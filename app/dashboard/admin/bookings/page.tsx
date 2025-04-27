import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookingsTable from "./components/bookings-table";
import BookingsTableSkeleton from "./components/bookings-table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBookings() {
  return await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      packageSchedule: {
        include: {
          package: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      bookingDate: "desc",
    },
  });
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bookings Management</CardTitle>
          <CardDescription>
            View and manage all customer bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<BookingsTableSkeleton />}>
            <BookingsTable initialBookings={bookings} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}