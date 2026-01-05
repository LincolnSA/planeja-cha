-- CreateTable
CREATE TABLE "Tea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parents_name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "custom_message" TEXT NOT NULL,
    "max_companions_per_guest" INTEGER NOT NULL,
    "invite_link" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tea" ADD CONSTRAINT "Tea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
