-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'client',
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hours" INTEGER NOT NULL DEFAULT 4,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "amount" INTEGER NOT NULL,
    "packageType" TEXT,
    "message" TEXT,
    "photographerNotes" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancellationReason" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "advancePaid" INTEGER NOT NULL DEFAULT 0,
    "isCustomPrice" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Cash',
    "totalPaid" INTEGER NOT NULL DEFAULT 0,
    "isOffline" BOOLEAN NOT NULL DEFAULT false,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "photographerName" TEXT,
    "travelCharges" INTEGER NOT NULL DEFAULT 0,
    "packageFeatures" TEXT[],

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentInstallment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL DEFAULT 'Cash',
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "PaymentInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientQuery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userEmail" TEXT,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "message" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientQueryMessage" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "queryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientQueryMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "qrCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "albumId" TEXT,
    "driveLink" TEXT,
    "isFaceProcessed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zipPath" TEXT,
    "aiStatus" TEXT NOT NULL DEFAULT 'Pending',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "currentProgress" INTEGER NOT NULL DEFAULT 0,
    "totalPhotos" INTEGER NOT NULL DEFAULT 0,
    "lastPhoto" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamApplication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "specialization" TEXT[],
    "portfolioUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_albumId_key" ON "Event"("albumId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInstallment" ADD CONSTRAINT "PaymentInstallment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientQuery" ADD CONSTRAINT "ClientQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientQueryMessage" ADD CONSTRAINT "ClientQueryMessage_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "ClientQuery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
