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
  console.log("Starting to seed packages...");

  // Create package categories
  console.log("Creating package categories...");
  const weddingCategory = await prisma.packageCategory.upsert({
    where: { name: "Wedding Photography" },
    update: {},
    create: {
      name: "Wedding Photography",
      description: "Full day wedding photography coverage",
      order: 1,
    },
  });
  console.log("Created wedding category:", weddingCategory.id);

  const elopementCategory = await prisma.packageCategory.upsert({
    where: { name: "Elopement Photography" },
    update: {},
    create: {
      name: "Elopement Photography",
      description: "Intimate elopement photography coverage",
      order: 2,
    },
  });
  console.log("Created elopement category:", elopementCategory.id);

  // Create packages
  console.log("Creating packages...");
  const fullDayWedding = await prisma.package.create({
    data: {
      name: "Full Day Wedding",
      description:
        "Complete wedding day coverage from preparation to reception",
      duration: 12,
      price: 3500,
      images: ["/wedding-1.jpg", "/wedding-2.jpg"],
      highlights: [
        "12 hours of coverage",
        "Two photographers",
        "600+ edited photos",
        "Online gallery",
        "Engagement session included",
      ],
      inclusions: [
        "Pre-wedding consultation",
        "High-resolution digital files",
        "Private online gallery",
        "Travel within Iceland",
        "Second photographer",
        "Engagement session",
      ],
      exclusions: [
        "Physical albums (available as add-on)",
        "Additional hours beyond 12",
      ],
      published: true,
      categoryId: weddingCategory.id,
    },
  });
  console.log("Created full day wedding package:", fullDayWedding.id);

  const intimateElopement = await prisma.package.create({
    data: {
      name: "Intimate Elopement",
      description: "Perfect for intimate ceremonies and adventurous couples",
      duration: 6,
      price: 2000,
      images: ["/elopement-1.jpg", "/elopement-2.jpg"],
      highlights: [
        "6 hours of coverage",
        "One photographer",
        "300+ edited photos",
        "Online gallery",
        "Location scouting",
      ],
      inclusions: [
        "Pre-elopement consultation",
        "High-resolution digital files",
        "Private online gallery",
        "Travel within Iceland",
        "Location recommendations",
      ],
      exclusions: [
        "Physical albums (available as add-on)",
        "Additional hours beyond 6",
      ],
      published: true,
      categoryId: elopementCategory.id,
    },
  });
  console.log("Created intimate elopement package:", intimateElopement.id);

  // Create some schedules
  console.log("Creating schedules...");
  const today = new Date();

  // Create schedules for the next 30 days
  for (let i = 1; i <= 5; i++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + i * 3); // Every 3 days

    const startTime = new Date(scheduleDate);
    startTime.setHours(10, 0, 0, 0);

    const endTime = new Date(scheduleDate);
    endTime.setHours(16, 0, 0, 0);

    await prisma.packageSchedule.create({
      data: {
        packageId: intimateElopement.id,
        date: scheduleDate,
        startTime,
        endTime,
        price: 2000,
        available: true,
        status: "OPEN",
      },
    });
    console.log(`Created schedule for ${scheduleDate.toDateString()}`);
  }

  console.log("Seeding completed successfully!");
}

async function main() {
  try {
    console.log("=== STARTING DATABASE SEED ===");

    // Clear existing data
    console.log("1. Clearing existing data...");
    console.log("1.1 Deleting bookings...");
    const deletedBookings = await prisma.booking.deleteMany();
    console.log(`1.1 Deleted ${deletedBookings.count} bookings`);

    console.log("1.2 Deleting package schedules...");
    const deletedSchedules = await prisma.packageSchedule.deleteMany();
    console.log(`1.2 Deleted ${deletedSchedules.count} schedules`);

    console.log("1.3 Deleting packages...");
    const deletedPackages = await prisma.package.deleteMany();
    console.log(`1.3 Deleted ${deletedPackages.count} packages`);

    console.log("1.4 Deleting package categories...");
    const deletedCategories = await prisma.packageCategory.deleteMany();
    console.log(`1.4 Deleted ${deletedCategories.count} categories`);

    console.log("✅ All existing data cleared successfully");

    // Seed new data
    console.log("2. Starting to seed new data...");
    await seedWorkItems();
    await seedPackages();

    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ ERROR DURING SEEDING:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Fatal error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
    console.log("Disconnected.");
  });

export {};
