import { Package as PrismaPackage, Prisma } from "@prisma/client";

// Use Prisma's utility type for packages with relations
export type PackageWithRelations = Prisma.PackageGetPayload<{
  include: {
    category: true;
    schedules: true;
    tags: true;
  };
}>;

// UI-specific helper type that extends the Prisma type
export interface PackageListItem extends PrismaPackage {
  category?: { name: string } | null;
  schedules?: Array<{ id: string }>;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: Prisma.Decimal;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  published: boolean;
  deleted?: boolean | null;
  deletedAt?: Date | null;
  categoryId?: string | null;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  schedules?: Array<{
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    price: Prisma.Decimal;
    available: boolean;
    status: string;
    notes?: string | null;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

// Helper type for schedule display
export interface PackageScheduleDisplay {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  available: boolean;
  price: Prisma.Decimal;
  formattedDate: string; // e.g., "June 1, 2023"
  formattedTimeRange: string; // e.g., "9:00 AM - 11:00 AM"
}
