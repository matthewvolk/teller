import { PlaidLink } from "@/components/PlaidLink";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();

  const plaid = api.plaid.createLinkToken.useQuery();

  if (session.status === "unauthenticated") {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Teller - Dashboard</title>
        <meta name="description" content="Teller - Dashboard" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="container mx-auto p-4">
        <header>
          <nav className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Hi, {session.data?.user.name} 👋
            </h1>
            <button
              onClick={() => void signOut()}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white"
            >
              Sign Out
            </button>
          </nav>
        </header>

        <div className="my-8">
          <Accounts />
        </div>

        {plaid.isSuccess && <PlaidLink linkToken={plaid.data} />}
        {plaid.isError && <p>Link Error: {plaid.error.message}</p>}
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
        <table className="table-fixed rounded-md text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-6 py-2">Name</th>
              <th className="px-6 py-2">Official Name</th>
              <th className="px-6 py-2">Type</th>
              <th className="px-6 py-2">Subtype</th>
              <th className="px-6 py-2">Mask</th>
              <th className="px-6 py-2">Account ID</th>
              <th className="px-6 py-2">Current Balance</th>
              <th className="px-6 py-2">Available Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.data.map((account) => (
              <tr key={account.account_id} className="border-b">
                <td className="px-6 py-2">{account.name}</td>
                <td className="px-6 py-2">{account.official_name}</td>
                <td className="px-6 py-2">{account.type}</td>
                <td className="px-6 py-2">{account.subtype}</td>
                <td className="px-6 py-2">{account.mask}</td>
                <td className="px-6 py-2">{account.account_id}</td>
                <td className="px-6 py-2">{account.balances.current}</td>
                <td className="px-6 py-2">{account.balances.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
