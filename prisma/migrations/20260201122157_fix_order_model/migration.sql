/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DEFAULT 0;

-- AlterTable
CREATE SEQUENCE orderitem_id_seq;
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('orderitem_id_seq'),
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE orderitem_id_seq OWNED BY "OrderItem"."id";
