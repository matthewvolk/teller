import { Protect } from "@clerk/nextjs";

import { db } from "@/db";

export default async function Home() {
  const transactions = await db.query.transactions.findMany();

  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <main className="flex-1">
      <Protect>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <table>
          <thead>
            <tr className="*:pr-6">
              <th>merchant_id</th>
              <th>amount</th>
              <th>need</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(({ id, merchantId, amount, need }) => (
              <tr key={id}>
                <td>{merchantId}</td>
                <td>{usd.format(parseFloat(amount))}</td>
                <td>{need ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Protect>
    </main>
  );
}
