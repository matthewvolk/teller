import { PlaidLink } from "@/components/PlaidLink";
import { api } from "@/utils/api";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
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
      <main>
        <header>
          <nav>
            <button onClick={() => void signOut()}>[Sign Out]</button>
          </nav>
        </header>

        <Accounts />

        {plaid.isSuccess && <PlaidLink linkToken={plaid.data} />}
        {plaid.isError && <p>Link Error: {plaid.error.message}</p>}

        <button onClick={() => email.mutate()}>[Send Email]</button>

        {email.isSuccess && email.data && (
          <a href={email.data} target="_blank" rel="noopener noreferrer">
            [Preview Email]
          </a>
        )}

        <p className="text-red-500">
          @TODO: Update items via Link when access_token expires:{" "}
          <a
            href="https://plaid.com/docs/link/update-mode/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://plaid.com/docs/link/update-mode/
          </a>
        </p>
      </main>
    </>
  );
}

const Accounts = () => {
  /**
   * @todo
   * If no accounts, send daily email with link to add account
   */
  const accounts = api.plaid.getAccountData.useQuery();

  if (accounts.isLoading) {
    return <p>Loading...</p>;
  }

  if (accounts.isError) {
    return <p>Error: {accounts.error.message}</p>;
  }

  if (!accounts.data.length) {
    return <p>Link a Bank Account to get started</p>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mask</th>
            <th>Current Balance</th>
            <th>Available Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.data.map((account) => (
            <tr key={account.account_id}>
              <td>{account.name}</td>
              <td>{account.mask}</td>
              <td className="text-green-600">
                {usd.format(account.balances.current as number)}
              </td>
              <td className="text-green-600">
                {usd.format(account.balances.available as number)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
