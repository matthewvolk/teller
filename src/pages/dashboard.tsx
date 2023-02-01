import { PlaidLink } from "@/components/PlaidLink";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();

  const plaid = api.plaid.createLinkToken.useQuery();
  const email = api.email.send.useMutation();

  if (session.status === "unauthenticated") {
    void router.push("/");
  }

  return (
    <>
      <Head>
        <title>Teller - Dashboard</title>
        <meta name="description" content="Teller - Dashboard" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="container mx-auto max-w-5xl p-8">
        <header>
          <nav className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="rounded p-2 text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.85}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </Link>
            <button
              onClick={() => void signOut()}
              className="rounded px-3 py-2 font-medium text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
            >
              Sign Out
            </button>
          </nav>
        </header>

        <div className="my-8">
          <Accounts />
        </div>

        <div className="flex justify-between">
          <div>
            {plaid.isSuccess && <PlaidLink linkToken={plaid.data} />}
            {plaid.isError && <p>Link Error: {plaid.error.message}</p>}
          </div>

          <button
            onClick={() => email.mutate()}
            className="rounded px-3 py-2 font-medium text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
          >
            Send Email
          </button>
        </div>

        {email.isSuccess && email.data && (
          <div className="mt-4 flex justify-end">
            <p>
              <a
                href={email.data}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Preview Email
              </a>
            </p>
          </div>
        )}
      </main>
    </>
  );
}

const Accounts = () => {
  const accounts = api.plaid.getAccountData.useQuery();

  if (accounts.isLoading) {
    return <p>Loading...</p>;
  }

  if (accounts.isError) {
    return <p>Error: {accounts.error.message}</p>;
  }

  if (!accounts.data.length) {
    return <p>Link a Bank Account to get started!</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-md text-left text-sm">
          <thead className="bg-slate-500/5 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Mask</th>
              <th className="px-6 py-3">Current Balance</th>
              <th className="px-6 py-3">Available Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.data.map((account) => (
              <tr
                key={account.account_id}
                className="border-b hover:bg-slate-500/5"
              >
                <td className="px-6 py-2 font-medium">{account.name}</td>
                <td className="px-6 py-2 font-mono">{account.mask}</td>
                <td className="px-6 py-2 font-mono text-green-600">
                  {usd.format(account.balances.current as number)}
                </td>
                <td className="px-6 py-2 font-mono text-green-600">
                  {usd.format(account.balances.available as number)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
