import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Camera,
  Clock,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

export default async function PackagePage({
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
    },
    include: {
      category: true,
      tags: true,
      schedules: {
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 1,
      },
    },
  });

  if (!package_) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] w-full">
        <Image
          src={package_.images[0] || "/images/placeholder-package.jpg"}
          alt={package_.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                {package_.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="capitalize">
                    {tag.name}
                  </Badge>
                ))}
                <Badge className="bg-blue-100 text-blue-800">
                  {package_.category?.name}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4 font-primary">
                {package_.name}
              </h1>
              <p className="text-gray-600 mb-6 font-primary">
                {package_.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">
                    {package_.duration} hours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">Professional Photography</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">
                    ${package_.price.toString()}
                  </span>
                </div>
              </div>

              <Link href={`/packages/${package_.id}/book`}>
                <Button size="lg" className="w-full md:w-auto font-primary">
                  Book Now
                </Button>
              </Link>
            </div>

            <div className="lg:w-1/3 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 font-primary">
                Package Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-primary">
                      Deliverables
                    </p>
                    <p className="font-medium font-primary">
                      High-resolution digital images
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-primary">
                      Next Available
                    </p>
                    <p className="font-medium font-primary">
                      {package_.schedules[0]?.date
                        ? new Date(
                            package_.schedules[0].date
                          ).toLocaleDateString()
                        : "Contact for availability"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-2">Highlights</h3>
            <ul className="list-disc list-inside">
              {package_.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-600">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What's Included</h3>
            <ul className="list-disc list-inside">
              {package_.inclusions.map((inclusion, index) => (
                <li key={index} className="text-gray-600">
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What's Not Included</h3>
            <ul className="list-disc list-inside">
              {package_.exclusions.map((exclusion, index) => (
                <li key={index} className="text-gray-600">
                  {exclusion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
