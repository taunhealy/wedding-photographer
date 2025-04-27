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
    const errorData = await response.json();
    console.error("PayPal token error:", errorData);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { packageId, scheduleId, amount, currency, contactInfo } = body;

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

    // Store user ID in custom_id if available
    const customData = {
      scheduleId,
      packageId,
      contactInfo,
      userId: session?.user?.id || null,
    };

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
              currency_code: currency || "USD",
              value: amount.toString(),
            },
            description: `Booking for ${packageSchedule.package.name}`,
            custom_id: JSON.stringify(customData),
          },
        ],
        application_context: {
          brand_name: "Off The Grid Weddings",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXTAUTH_URL}/api/checkout/capture-payment`,
          cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("PayPal order creation error:", errorData);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const order = await response.json();

    // Create a record in the PaypalOrder table
    await prisma.paypalOrder.create({
      data: {
        orderId: order.id,
        status: "CREATED",
        packageId,
        scheduleId,
        amount: parseFloat(amount),
        contactInfo,
      },
    });

    // If user is logged in, create an audit log
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE",
          entityType: "PAYPAL_ORDER",
          entityId: order.id,
          details: {
            packageId,
            scheduleId,
            amount,
            status: "CREATED",
          },
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: (error as Error).message },
      { status: 500 }
    );
  }
}
