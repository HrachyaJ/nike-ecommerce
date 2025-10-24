import { db } from "@/lib/db";
import { addresses, type InsertAddress } from "@/lib/db/schema/addresses";
import { eq } from "drizzle-orm";

export async function getAddresses(userId: string) {
  return await db.query.addresses.findMany({
    where: eq(addresses.userId, userId),
  });
}

export async function addAddress(data: InsertAddress) {
  return await db.insert(addresses).values(data);
}

export async function updateAddress(data: InsertAddress & { id: string }) {
  const { id, ...updateData } = data;

  // If this is being set as default, unset any other default addresses of the same type
  if (updateData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(
        eq(addresses.userId, updateData.userId) &&
          eq(addresses.type, updateData.type)
      );
  }

  return await db.update(addresses).set(updateData).where(eq(addresses.id, id));
}

export async function deleteAddress(addressId: string) {
  return await db.delete(addresses).where(eq(addresses.id, addressId));
}
