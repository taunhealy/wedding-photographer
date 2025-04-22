import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Update schema to match the BookingForm data structure
const bookingSchema = z.object({
  packageId: z.string(),
  scheduleId: z.string(),
  participants: z.number(),
  totalPrice: z.number(),
  contactInfo: z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const validated = bookingSchema.parse(data);

    // Check if package exists and is available
    const package_ = await prisma.package.findUnique({
      where: {
        id: params.id,
        deleted: false,
      },
      include: {
        schedules: {
          where: {
            id: validated.scheduleId,
            status: "OPEN",
          },
        },
      },
    });

    if (!package_ || !package_.schedules.length) {
      return NextResponse.json(
        { error: "Package or schedule not available" },
        { status: 400 }
      );
    }

    const schedule = package_.schedules[0];

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session?.user?.id || "", // Handle guest bookings if needed
        packageScheduleId: schedule.id,
        totalAmount: validated.totalPrice,
        paidAmount: 0, // Will be updated after payment
        status: "PENDING",
        eventDetails: {
          create: {
            eventDate: schedule.date,
            eventType: package_.categoryId || "PHOTOGRAPHY",
            // Add basic event details, can be updated later
            venueName: "",
            venueAddress: "",
          },
        },
        metadata: {
          contactInfo: validated.contactInfo,
          participants: validated.participants,
        },
      },
      include: {
        eventDetails: true,
      },
    });

    // Update schedule status
    await prisma.packageSchedule.update({
      where: { id: schedule.id },
      data: { status: "PENDING" },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id || "",
        action: "CREATE",
        entityType: "Booking",
        entityId: booking.id,
        details: {
          bookingId: booking.id,
          packageId: package_.id,
          scheduleId: schedule.id,
          amount: validated.totalPrice,
          status: "PENDING",
        },
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking: {
        ...booking,
        package: package_,
        schedule: schedule,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// Add GET endpoint to check booking status
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        packageSchedule: true,
        eventDetails: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
