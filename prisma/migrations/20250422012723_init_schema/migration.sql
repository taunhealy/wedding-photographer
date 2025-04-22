-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "PaypalOrderStatus" AS ENUM ('CREATED', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHOTO_PRINT', 'PHOTO_ALBUM', 'FRAME', 'CANVAS', 'DIGITAL_DOWNLOAD');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'DISCONTINUED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "phone" TEXT,
    "address" TEXT,
    "image" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" MONEY NOT NULL,
    "images" TEXT[],
    "highlights" TEXT[],
    "inclusions" TEXT[],
    "exclusions" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSchedule" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "PackageSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageScheduleId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDetails" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'WEDDING',
    "numberOfGuests" INTEGER,
    "additionalPhotographers" BOOLEAN NOT NULL DEFAULT false,
    "timeline" JSONB,
    "contactPersonName" TEXT,
    "contactPersonPhone" TEXT,

    CONSTRAINT "EventDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionId" TEXT,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentPlanId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "highlight" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "anniversaryDate" TIMESTAMP(3),
    "preferredStyle" TEXT,
    "notes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "installments" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,

    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageScheduleId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaypalOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "PaypalOrderStatus" NOT NULL,
    "packageId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaypalOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "coverImage" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "couple" TEXT,
    "venue" TEXT,
    "categoryId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" MONEY NOT NULL,
    "platformFee" MONEY NOT NULL,
    "photographerPrice" MONEY NOT NULL,
    "finalPrice" MONEY NOT NULL,
    "type" "ProductType" NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "workItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "dimensions" TEXT,
    "material" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "minMarkup" DECIMAL(5,2) NOT NULL,
    "maxMarkup" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackageTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackageTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorkItemTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkItemTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Package_categoryId_idx" ON "Package"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "EventDetails_bookingId_key" ON "EventDetails"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_bookingId_key" ON "PaymentPlan"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaypalOrder_orderId_key" ON "PaypalOrder"("orderId");

-- CreateIndex
CREATE INDEX "PaypalOrder_orderId_idx" ON "PaypalOrder"("orderId");

-- CreateIndex
CREATE INDEX "PaypalOrder_packageId_idx" ON "PaypalOrder"("packageId");

-- CreateIndex
CREATE INDEX "PaypalOrder_scheduleId_idx" ON "PaypalOrder"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkItem_slug_key" ON "WorkItem"("slug");

-- CreateIndex
CREATE INDEX "WorkItem_categoryId_idx" ON "WorkItem"("categoryId");

-- CreateIndex
CREATE INDEX "WorkItem_published_idx" ON "WorkItem"("published");

-- CreateIndex
CREATE INDEX "WorkItem_featured_idx" ON "WorkItem"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_name_key" ON "WorkCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_slug_key" ON "WorkCategory"("slug");

-- CreateIndex
CREATE INDEX "WorkCategory_order_idx" ON "WorkCategory"("order");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTag_name_key" ON "WorkTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTag_slug_key" ON "WorkTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_date_startTime_endTime_key" ON "Availability"("date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Product_workItemId_idx" ON "Product"("workItemId");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategory_name_key" ON "PackageCategory"("name");

-- CreateIndex
CREATE INDEX "PackageCategory_order_idx" ON "PackageCategory"("order");

-- CreateIndex
CREATE INDEX "_PackageTags_B_index" ON "_PackageTags"("B");

-- CreateIndex
CREATE INDEX "_WorkItemTags_B_index" ON "_WorkItemTags"("B");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSchedule" ADD CONSTRAINT "PackageSchedule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageScheduleId_fkey" FOREIGN KEY ("packageScheduleId") REFERENCES "PackageSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDetails" ADD CONSTRAINT "EventDetails_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "PaymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_packageScheduleId_fkey" FOREIGN KEY ("packageScheduleId") REFERENCES "PackageSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "PackageSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorkCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageTags" ADD CONSTRAINT "_PackageTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageTags" ADD CONSTRAINT "_PackageTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTags" ADD CONSTRAINT "_WorkItemTags_A_fkey" FOREIGN KEY ("A") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTags" ADD CONSTRAINT "_WorkItemTags_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
