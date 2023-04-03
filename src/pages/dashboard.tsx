import { Theme } from "@/components/Theme";
import { api } from "@/utils/api";
import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { usePlaidLink } from "react-plaid-link";

const Dashboard: NextPage = () => {
  const plaidItems = api.plaid.getAllAccounts.useQuery();
  const createLinkToken = api.plaid.createLinkToken.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard - Teller</title>
        <meta
          name="description"
          content="Teller is an email service for money management"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="container mx-auto p-4">
        <nav className="flex items-center justify-between pb-4">
          <h1>Dashboard</h1>
          <div className="flex items-center gap-2">
            <Theme />
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>

        <p>{plaidItems.isLoading && "Loading..."}</p>
        <p>{plaidItems.isError && plaidItems.error.message}</p>
        {plaidItems.isSuccess &&
          plaidItems.data.map((item) => (
            <pre key={item.item.item_id}>{JSON.stringify(item, null, 2)}</pre>
          ))}

        <p>{createLinkToken.isLoading && "Loading..."}</p>
        <p>{createLinkToken.isError && createLinkToken.error.message}</p>
        <p>
          {createLinkToken.isSuccess && (
            <Link linkToken={createLinkToken.data.link_token} />
          )}
        </p>
      </main>
    </>
  );
};

interface LinkProps {
  linkToken: string | null;
}

const Link: React.FC<LinkProps> = ({ linkToken }) => {
  const ctx = api.useContext();
  const exchangePublicToken = api.plaid.exchangePublicToken.useMutation();

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess: (public_token, _metadata) => {
      exchangePublicToken.mutate(
        { publicToken: public_token },
        {
          onSuccess: () => {
            void ctx.plaid.getAllAccounts.invalidate();
          },
        }
      );
    },
  };
  const { open, ready } = usePlaidLink(config);
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};

export default Dashboard;
