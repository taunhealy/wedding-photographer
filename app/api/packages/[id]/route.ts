import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Properly await the params in Next.js
    const { id } = await context.params;

    const package_ = await prisma.package.findUnique({
      where: {
        id,
        deleted: false,
      },
      include: {
        schedules: true,
        category: true,
        tags: true,
      },
    });

    if (!package_) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(package_);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const package_ = await prisma.package.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        published: data.published,
        images: data.images,
        category: data.categoryId
          ? {
              connect: { id: data.categoryId },
            }
          : undefined,
        tags: data.tags?.length
          ? {
              set: data.tags.map((id: string) => ({ id })),
            }
          : undefined,
        highlights: data.highlights,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
      },
    });

    return NextResponse.json(package_);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Soft delete approach
    await prisma.package.update({
      where: { id: params.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
