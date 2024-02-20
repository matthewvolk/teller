import { PlaidLink } from "@/components/PlaidLink";
import { Transactions } from "@/components/Transactions";
import { db } from "@/db";
import { linkTokenCreate } from "@/lib/plaid";

export default async function Home() {
  const { linkToken } = await linkTokenCreate();

  const item = await db.query.items.findFirst();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Teller</h1>
      <PlaidLink linkToken={linkToken} />
      <Transactions item={item} />
    </section>
  );
}
