import Image from "next/image";
import Link from "next/link";

import { SelectItem } from "@/db/schema";
import { accountsGet, transactionsSync } from "@/lib/plaid";

export const Transactions = async ({
  item,
}: {
  item: SelectItem | undefined;
}) => {
  if (!item) {
    return null;
  }

  const accounts = await accountsGet(item);
  console.log(accounts);
  const transactions = await transactionsSync(item);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Accounts</h2>

      <h3 className="text-lg font-semibold">Accounts</h3>
      <div className="max-h-96 overflow-scroll">
        <table className="w-full text-left [&_td]:whitespace-nowrap [&_td]:border [&_td]:px-2 [&_th]:whitespace-nowrap [&_th]:border [&_th]:px-2 [&_th]:font-medium">
          <thead>
            <tr>
              <th>name</th>
              <th>account_id</th>
              <th>type</th>
              <th>subtype</th>
              <th>mask</th>
              <th>balances.available</th>
              <th>balances.current</th>
              <th>official_name</th>
              <th>persistent_account_id</th>
              <th>balances.iso_currency_code</th>
              <th>balances.limit</th>
              <th>balances.unofficial_currency_code</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.accounts.map((account) => (
              <tr key={account.account_id}>
                <td>{account.name}</td>
                <td>{account.account_id}</td>
                <td>{account.type}</td>
                <td>{account.subtype}</td>
                <td>{account.mask}</td>
                <td>{account.balances.available}</td>
                <td>{account.balances.current}</td>
                <td>{account.official_name}</td>
                <td>{account.persistent_account_id}</td>
                <td>{account.balances.iso_currency_code}</td>
                <td>{account.balances.limit}</td>
                <td>{account.balances.unofficial_currency_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold">Transactions</h3>
      <div className="max-h-96 overflow-scroll">
        <table className="w-full text-left [&_td]:whitespace-nowrap [&_td]:border [&_td]:px-2 [&_th]:whitespace-nowrap [&_th]:border [&_th]:px-2 [&_th]:font-medium">
          <thead>
            <tr>
              <th>account</th>
              <th>transaction_id</th>
              <th>logo_url</th>
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
              <tr key={transaction.transaction_id}>
                <td>
                  {
                    accounts?.accounts.find(
                      (t) => t.account_id === transaction.account_id,
                    )?.name
                  }
                </td>
                <td>{transaction.transaction_id}</td>
                <td>
                  {transaction.logo_url ? (
                    <Image
                      alt={"tmp"}
                      height={15}
                      src={transaction.logo_url}
                      width={15}
                    />
                  ) : null}
                </td>
                <td>
                  {transaction.website ? (
                    <Link
                      className="text-blue-500 hover:underline"
                      href={`https://${transaction.website}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {transaction.merchant_name}
                    </Link>
                  ) : (
                    transaction.merchant_name
                  )}
                </td>
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
    </div>
  );
};
