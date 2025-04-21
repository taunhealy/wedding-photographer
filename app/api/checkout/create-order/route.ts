import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { packageId, scheduleId, amount, currency, contactInfo } =
      await request.json();

    // Validate the package and schedule exist
    const packageSchedule = await prisma.packageSchedule.findFirst({
      where: {
        id: scheduleId,
        packageId: packageId,
        available: true,
        status: "OPEN",
      },
      include: {
        package: true,
      },
    });

    if (!packageSchedule) {
      return NextResponse.json(
        { error: "Package schedule not available" },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toString(),
            },
            description: `Booking for ${packageSchedule.package.name}`,
            custom_id: JSON.stringify({
              scheduleId,
              contactInfo,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create PayPal order");
    }

    const order = await response.json();

    // Create a record in the PaypalOrder table
    await prisma.paypalOrder.create({
      data: {
        orderId: order.id,
        status: "CREATED",
        packageId,
        scheduleId,
        amount,
        contactInfo,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
