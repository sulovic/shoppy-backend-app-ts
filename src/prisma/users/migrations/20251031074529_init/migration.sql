-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "roleId" INTEGER NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "roleId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_role_key" ON "UserRoles"("role");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRoles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
