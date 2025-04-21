import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedWorkItems() {
  // Upsert work categories
  const elopementCategory = await prisma.workCategory.upsert({
    where: { name: "Elopements" },
    update: {},
    create: {
      name: "Elopements",
      slug: "elopements",
      description: "Beautiful elopement photography in Iceland",
      order: 1,
    },
  });

  const weddingCategory = await prisma.workCategory.upsert({
    where: { name: "Weddings" },
    update: {},
    create: {
      name: "Weddings",
      slug: "weddings",
      description: "Intimate wedding photography in Iceland",
      order: 2,
    },
  });

  // Upsert work items
  await prisma.workItem.upsert({
    where: { slug: "intimate-glacier-elopement" },
    update: {},
    create: {
      title: "Intimate Glacier Elopement",
      slug: "intimate-glacier-elopement",
      description: "A beautiful intimate elopement on Vatnajökull glacier",
      content: "Full story of this amazing glacier elopement...",
      images: ["/wedding-1.jpg", "/wedding-2.jpg"],
      coverImage: "/wedding-1.jpg",
      published: true,
      featured: true,
      date: new Date("2024-03-15"),
      location: "Vatnajökull, Iceland",
      couple: "Emma & James",
      venue: "Vatnajökull Glacier",
      categoryId: elopementCategory.id,
      tags: {
        create: [
          { name: "Glacier Elopement", slug: "glacier-elopement" },
          { name: "Intimate Elopement", slug: "intimate-elopement" },
        ],
      },
    },
  });

  await prisma.workItem.upsert({
    where: { slug: "black-sand-beach-wedding" },
    update: {},
    create: {
      title: "Black Sand Beach Wedding",
      slug: "black-sand-beach-wedding",
      description: "A dreamy wedding photoshoot at Reynisfjara",
      content: "The story of this magical black sand beach wedding...",
      images: ["/beach-1.jpg", "/beach-2.jpg"],
      coverImage: "/beach-1.jpg",
      published: true,
      featured: true,
      date: new Date("2024-02-20"),
      location: "Reynisfjara, Iceland",
      couple: "Sofia & Alex",
      venue: "Reynisfjara Beach",
      categoryId: weddingCategory.id,
      tags: {
        create: [
          { name: "Beach Wedding", slug: "beach-wedding" },
          { name: "Destination Wedding", slug: "destination-wedding" },
        ],
      },
    },
  });

  await prisma.workItem.upsert({
    where: { slug: "northern-lights-elopement" },
    update: {},
    create: {
      title: "Northern Lights Elopement",
      slug: "northern-lights-elopement",
      description: "A magical elopement under the aurora borealis",
      content: "Capturing love under the dancing northern lights...",
      images: ["/aurora-1.jpg", "/aurora-2.jpg"],
      coverImage: "/aurora-1.jpg",
      published: true,
      featured: false,
      date: new Date("2024-01-10"),
      location: "Kirkjufell, Iceland",
      couple: "Maya & Thomas",
      venue: "Kirkjufell Mountain",
      categoryId: elopementCategory.id,
      tags: {
        create: [
          { name: "Northern Lights", slug: "northern-lights" },
          { name: "Winter Elopement", slug: "winter-elopement" },
        ],
      },
    },
  });
}

async function seedPackages() {
  const category = await prisma.packageCategory.create({
    data: {
      name: "Wedding Photography",
      description: "Our wedding photography packages",
    },
  });

  // Create packages
  await prisma.package.create({
    data: {
      name: "Elopement Adventure",
      description:
        "Perfect for adventurous couples seeking an intimate ceremony",
      duration: 6,
      price: 2500,
      images: ["/package-1.jpg"],
      highlights: [
        "6 hours of coverage",
        "2 locations",
        "150+ edited photos",
        "Private online gallery",
      ],
      inclusions: [
        "Pre-wedding consultation",
        "Location scouting",
        "Travel within Iceland",
        "High-resolution digital files",
      ],
      exclusions: ["Additional hours", "Printed albums", "Second photographer"],
      published: true,
      categoryId: category.id,
    },
  });

  await prisma.package.create({
    data: {
      name: "Intimate Wedding",
      description: "Comprehensive coverage for small weddings up to 30 guests",
      duration: 8,
      price: 3500,
      images: ["/package-2.jpg"],
      highlights: [
        "8 hours of coverage",
        "Multiple locations",
        "300+ edited photos",
        "Private online gallery",
      ],
      inclusions: [
        "Pre-wedding consultation",
        "Location scouting",
        "Travel within Iceland",
        "High-resolution digital files",
        "Second photographer",
      ],
      exclusions: ["Additional hours", "Printed albums"],
      published: true,
      categoryId: category.id,
    },
  });

  await prisma.package.create({
    data: {
      name: "Ultimate Collection",
      description: "Our most comprehensive wedding package",
      duration: 12,
      price: 5000,
      images: ["/package-3.jpg"],
      highlights: [
        "12 hours of coverage",
        "Unlimited locations",
        "500+ edited photos",
        "Private online gallery",
        "Premium photo album",
      ],
      inclusions: [
        "Pre-wedding consultation",
        "Location scouting",
        "Travel within Iceland",
        "High-resolution digital files",
        "Second photographer",
        "Engagement session",
        "Premium leather album",
      ],
      exclusions: ["Additional days"],
      published: true,
      categoryId: category.id,
    },
  });
}

async function main() {
  // Clear existing data
  await prisma.workItem.deleteMany();
  await prisma.workCategory.deleteMany();
  await prisma.workTag.deleteMany();

  // Seed new data
  await seedWorkItems();
  await seedPackages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
