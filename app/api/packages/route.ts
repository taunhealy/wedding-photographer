import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        category: true,
        schedules: true,
        tags: true,
      },
      where: {
        published: true,
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const package_ = await prisma.package.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        published: data.published || false,
        images: data.images || [],
        category: data.categoryId
          ? {
              connect: { id: data.categoryId },
            }
          : undefined,
        tags: data.tags?.length
          ? {
              connect: data.tags.map((id: string) => ({ id })),
            }
          : undefined,
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
      },
    });

    return NextResponse.json(package_, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
