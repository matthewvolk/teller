import { Theme } from "@/components/Theme";
import { api } from "@/utils/api";
import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { usePlaidLink } from "react-plaid-link";

const Dashboard: NextPage = () => {
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

        <div className="py-4">
          <Accounts />
        </div>

        <div className="py-4">
          <LinkAccountButton />
        </div>

        <div className="py-4">
          <Transactions />
        </div>
      </main>
    </>
  );
};

const Accounts = () => {
  const accountsWithInstitution = api.plaid.accountsWithInstitution.useQuery();

  if (accountsWithInstitution.isLoading) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Accounts</h1>
        <p>Loading...</p>
      </>
    );
  }

  if (accountsWithInstitution.isError) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Accounts</h1>
        <p className="font-mono text-red-500">
          Error: {accountsWithInstitution.error.message}
        </p>
      </>
    );
  }

  if (accountsWithInstitution.data.length < 1) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Accounts</h1>
        <p>Link an account to get started.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="pb-2 text-2xl font-medium">Accounts</h1>
      <div className="relative overflow-x-auto rounded-md border dark:border-neutral-700">
        <table className="w-full dark:border-neutral-700">
          <thead className="bg-neutral-100 text-left text-xs uppercase dark:bg-neutral-800">
            <tr className="border-b dark:border-neutral-700">
              <th className="whitespace-nowrap px-3 py-3">Institution</th>
              <th className="whitespace-nowrap px-3 py-3">Account</th>
              <th className="whitespace-nowrap px-3 py-3">Mask</th>
              <th className="whitespace-nowrap px-3 py-3">Type</th>
              <th className="whitespace-nowrap px-3 py-3">Current Balance</th>
              <th className="whitespace-nowrap px-3 py-3">Available Balance</th>
            </tr>
          </thead>
          <tbody>
            {accountsWithInstitution.data.map((account) => (
              <tr
                key={account.account_id}
                className="border-b hover:bg-neutral-100 dark:border-neutral-700 hover:dark:bg-neutral-800"
              >
                <td className="whitespace-nowrap px-3 py-1.5">
                  {account.institution_name}
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  {account.name}
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  <span className="whitespace-nowrap rounded-md bg-neutral-100 px-1 py-0.5 font-mono text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50">
                    {account.mask}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  {account.subtype}
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  <span className="whitespace-nowrap rounded-md bg-green-100/75 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                    $ {account.balances.current?.toFixed(2)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  <span className="whitespace-nowrap rounded-md bg-green-100/75 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                    $ {account.balances.available?.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Transactions = () => {
  const transactions = api.plaid.transactions.useQuery({
    /**
     * @todo dummy data - replace with dayjs
     */
    start: "2021-04-04",
    end: "2023-04-04",
  });

  if (transactions.isLoading) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Transactions</h1>
        <p>Loading...</p>
      </>
    );
  }

  if (transactions.isError) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Transactions</h1>
        <p className="font-mono text-red-500">
          Error: {transactions.error.message}
        </p>
      </>
    );
  }

  if (transactions.data.length < 1) {
    return (
      <>
        <h1 className="pb-2 text-2xl font-medium">Transactions</h1>
        <p>Link an account to get started.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="pb-2 text-2xl font-medium">Transactions</h1>
      <div className="relative overflow-x-auto rounded-md border dark:border-neutral-700">
        <table className="w-full dark:border-neutral-700">
          <thead className="bg-neutral-100 text-left text-xs uppercase dark:bg-neutral-800">
            <tr className="border-b dark:border-neutral-700">
              <th className="whitespace-nowrap px-3 py-3">Transaction</th>
              <th className="whitespace-nowrap px-3 py-3">Amount</th>
              <th className="whitespace-nowrap px-3 py-3">Account</th>
              <th className="whitespace-nowrap px-3 py-3">Mask</th>
              <th className="whitespace-nowrap px-3 py-3">Institution</th>
              <th className="whitespace-nowrap px-3 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.data
              .sort(
                (a, b) =>
                  new Date(b.date).valueOf() - new Date(a.date).valueOf()
              )
              .map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  className="border-b hover:bg-neutral-100 dark:border-neutral-700 hover:dark:bg-neutral-800"
                >
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <span className="whitespace-nowrap rounded-md bg-green-100/75 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                      $ {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.account_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <span className="whitespace-nowrap rounded-md bg-neutral-100 px-1 py-0.5 font-mono text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50">
                      {transaction.account_mask}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.institution_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.date}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const LinkAccountButton = () => {
  const createLinkToken = api.plaid.createLinkToken.useQuery();

  if (createLinkToken.isLoading) {
    return (
      <button
        disabled
        className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 hover:dark:bg-neutral-100"
      >
        Loading...
      </button>
    );
  }

  if (createLinkToken.isError) {
    return (
      <p className="font-mono text-red-500">
        Error: {createLinkToken.error.message}
      </p>
    );
  }

  return <Link linkToken={createLinkToken.data.link_token} />;
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
            void ctx.plaid.accountsWithInstitution.invalidate();
            void ctx.plaid.transactions.invalidate();
          },
        }
      );
    },
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      onClick={() => open()}
      disabled={!ready}
      className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 hover:dark:bg-neutral-100"
    >
      Link account
    </button>
  );
};

export default Dashboard;
