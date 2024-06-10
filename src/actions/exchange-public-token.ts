"use server";

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { itemPublicTokenExchange } from "@/lib/plaid";

export const exchangePublicToken = async (publicToken: string) => {
  const { accessToken, itemId } = await itemPublicTokenExchange(publicToken);

  await db.insert(accounts).values({ accessToken, itemId });
};
