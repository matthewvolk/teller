import { Protect } from "@clerk/nextjs";

import { PlaidLink } from "@/components/PlaidLink";
import { db } from "@/db";
import { accountsGet, linkTokenCreate, transactionsSync } from "@/lib/plaid";

export default async function Home() {
  const { linkToken } = await linkTokenCreate();

  const item = await db.query.accounts.findFirst();

  if (!item) {
    return (
      <main className="flex-1">
        <Protect>
          <PlaidLink linkToken={linkToken} />
        </Protect>
      </main>
    );
  }

  const accounts = await accountsGet(item);
  const transactions = await transactionsSync(item);

  return (
    <main className="flex-1">
      <Protect>
        <PlaidLink linkToken={linkToken} />

        <div className="max-h-96 overflow-scroll">
          <table className="w-full text-left">
            <thead>
              <tr className="*:whitespace-nowrap *:border *:px-2">
                <th>account</th>
                <th>transaction_id</th>
                <th>merchant_name</th>
                <th>name</th>
                <th>amount</th>
                <th>authorized_date</th>
                <th>date</th>
                <th>iso_currency_code</th>
                <th>payment_channel</th>
                <th>pending</th>
                <th>pending_transaction_id</th>
                <th>personal_finance_category.confidence_level</th>
                <th>personal_finance_category.detailed</th>
                <th>personal_finance_category.primary</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.added.map((transaction) => (
                <tr
                  className="*:whitespace-nowrap *:border *:px-2"
                  key={transaction.transaction_id}
                >
                  <td>
                    {
                      accounts?.accounts.find(
                        (t) => t.account_id === transaction.account_id,
                      )?.name
                    }
                  </td>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.merchant_name}</td>
                  <td>{transaction.name}</td>
                  <td className="text-right">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(transaction.amount)}
                  </td>
                  <td>
                    {transaction.authorized_date
                      ? new Date(transaction.authorized_date).toLocaleString()
                      : null}
                  </td>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>{transaction.iso_currency_code}</td>
                  <td>{transaction.payment_channel}</td>
                  <td>{transaction.pending}</td>
                  <td>{transaction.pending_transaction_id}</td>
                  <td>
                    {transaction.personal_finance_category?.confidence_level}
                  </td>
                  <td>{transaction.personal_finance_category?.detailed}</td>
                  <td>{transaction.personal_finance_category?.primary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Protect>
    </main>
  );
}
