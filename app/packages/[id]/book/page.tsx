import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import BookingForm from "@/app/components/packages/BookingForm";
import PayPalCheckout from "@/app/components/checkout/PayPalCheckout";
import { PackageSchedule } from "@prisma/client";
import { JsonValue } from "type-fest";

// Create a modified type with string dates
interface FormattedSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
  status: string;
  packageId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: JsonValue | null;
  notes: string | null;
}

export default async function BookPackagePage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return notFound();
  }

  const package_ = await prisma.package.findUnique({
    where: {
      id: params.id,
      deleted: false,
      published: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      schedules: {
        where: {
          date: {
            gte: new Date(),
          },
          status: "OPEN",
          available: true,
        },
        orderBy: {
          date: "asc",
        },
        include: {
          bookings: {
            where: {
              status: {
                in: ["PENDING", "CONFIRMED"],
              },
            },
          },
        },
      },
    },
  });

  if (!package_) {
    return notFound();
  }

  const availableSchedules = package_.schedules.filter(
    (schedule) => schedule.bookings.length === 0
  );

  const formattedSchedules: FormattedSchedule[] = availableSchedules.map(
    (schedule) => ({
      ...schedule,
      date: schedule.date.toISOString(),
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString(),
      price: Number(schedule.price),
    })
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-primary">
            {package_.name}
          </h1>
          <p className="text-gray-600 font-primary">
            Complete your photography package booking
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-primary">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm
                packageId={package_.id}
                schedules={formattedSchedules}
                basePrice={Number(package_.price)}
                checkoutComponent={PayPalCheckout}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-primary">
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-primary">
              <div>
                <h3 className="font-semibold mb-2">Booking Policy</h3>
                <p className="text-gray-600">
                  A 50% deposit is required to secure your booking date. The
                  remaining balance is due 2 weeks before the event.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                <p className="text-gray-600">
                  Deposits are non-refundable. Cancellations made within 30 days
                  of the event are subject to the full payment amount.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">What to Prepare</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Shot list or specific photo requests</li>
                  <li>Timeline of the event</li>
                  <li>Venue details and contact information</li>
                  <li>Any special considerations or requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
