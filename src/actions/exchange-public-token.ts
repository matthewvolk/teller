"use server";

import { db } from "@/db";
import { items } from "@/db/schema";
import { itemPublicTokenExchange } from "@/lib/plaid";

export const exchangePublicToken = async (publicToken: string) => {
  const { accessToken, itemId } = await itemPublicTokenExchange(publicToken);

  console.log({ accessToken, itemId });

  await db.insert(items).values({ accessToken, itemId });
};
