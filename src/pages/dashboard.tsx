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
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-2xl font-medium">Accounts</h1>
            <LinkAccountButton />
          </div>

          <Accounts />
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
    return <Loading />;
  }

  if (accountsWithInstitution.isError) {
    return (
      <p className="rounded-md bg-red-100/75 p-4 font-mono text-sm text-red-800 dark:bg-red-800/75 dark:text-red-50">
        Error: {accountsWithInstitution.error.message}
      </p>
    );
  }

  if (accountsWithInstitution.data.length < 1) {
    return <p>Link an account to get started.</p>;
  }

  return (
    <div className="relative overflow-x-auto rounded-md border border-onyx-300 dark:border-onyx-700">
      <table className="w-full">
        <thead className="bg-onyx-300/50 text-left text-xs uppercase dark:bg-onyx-800">
          <tr className="border-b border-onyx-300 dark:border-onyx-700">
            <th className="whitespace-nowrap px-3 py-3">Institution</th>
            <th className="whitespace-nowrap px-3 py-3">Account</th>
            <th className="whitespace-nowrap px-3 py-3">Mask</th>
            <th className="whitespace-nowrap px-3 py-3">Current Balance</th>
            <th className="whitespace-nowrap px-3 py-3">Available Balance</th>
          </tr>
        </thead>
        <tbody>
          {accountsWithInstitution.data.map((account) => (
            <tr
              key={account.account_id}
              className="border-b border-onyx-300/50 last:border-none hover:bg-onyx-300/50 dark:border-onyx-700 hover:dark:bg-onyx-800"
            >
              <td className="whitespace-nowrap px-3 py-1.5">
                {account.institution_name}
              </td>
              <td className="whitespace-nowrap px-3 py-1.5">{account.name}</td>
              <td className="whitespace-nowrap px-3 py-1.5 font-mono">
                {account.mask}
              </td>
              <td className="whitespace-nowrap px-3 py-1.5">
                {(account.balances.current as number) > 0 ? (
                  <span className="whitespace-nowrap rounded-md bg-green-300/30 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                    ${account.balances.current?.toFixed(2)}
                  </span>
                ) : (
                  <span className="whitespace-nowrap rounded-md bg-red-300/30 px-1 py-0.5 text-red-800 dark:bg-red-800/75 dark:text-red-50">
                    ${account.balances.current?.toFixed(2)}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-1.5">
                {(account.balances.available as number) > 0 ? (
                  <span className="whitespace-nowrap rounded-md bg-green-300/30 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                    ${account.balances.available?.toFixed(2)}
                  </span>
                ) : (
                  <span className="whitespace-nowrap rounded-md bg-red-300/30 px-1 py-0.5 text-red-800 dark:bg-red-800/75 dark:text-red-50">
                    ${account.balances.available?.toFixed(2)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
        <h1 className="pb-4 text-2xl font-medium">Transactions</h1>
        <Loading />
      </>
    );
  }

  if (transactions.isError) {
    return (
      <>
        <h1 className="pb-4 text-2xl font-medium">Transactions</h1>
        <p className="rounded-md bg-red-300/30 p-4 font-mono text-sm text-red-800 dark:bg-red-800/75 dark:text-red-50">
          Error: {transactions.error.message}
        </p>
      </>
    );
  }

  if (transactions.data.length < 1) {
    return (
      <>
        <h1 className="pb-4 text-2xl font-medium">Transactions</h1>
        <p>Link an account to get started.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="pb-4 text-2xl font-medium">Transactions</h1>
      <div className="relative overflow-x-auto rounded-md border border-onyx-300/50 dark:border-onyx-700">
        <table className="w-full">
          <thead className="bg-onyx-300/50 text-left text-xs uppercase dark:bg-onyx-800">
            <tr className="border-b border-onyx-300/50 dark:border-onyx-700">
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
                  className="border-b border-onyx-300/50 last:border-none hover:bg-onyx-300/50 dark:border-onyx-700 hover:dark:bg-onyx-800"
                >
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.amount > 0 ? (
                      <span className="whitespace-nowrap rounded-md bg-green-300/30 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap rounded-md bg-red-300/30 px-1 py-0.5 text-red-800 dark:bg-red-800/75 dark:text-red-50">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {transaction.account_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5 font-mono">
                    {transaction.account_mask}
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
  const createLinkToken = api.plaid.createLinkToken.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (createLinkToken.isLoading) {
    return (
      <button
        disabled
        className="rounded-md bg-onyx-900 px-4 py-2 text-sm font-medium text-onyx-200 hover:bg-onyx-700 dark:bg-onyx-200 dark:text-onyx-900 hover:dark:bg-onyx-100"
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
      className="flex items-center gap-1.5 rounded-md bg-onyx-900 px-4 py-2 text-sm font-medium text-onyx-200 hover:bg-onyx-700 dark:bg-onyx-200 dark:text-onyx-900 hover:dark:bg-onyx-100"
    >
      <span>Link account</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="-mr-0.5 h-4 w-4"
      >
        <path
          fillRule="evenodd"
          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default Dashboard;

const Loading = () => (
  <div
    role="status"
    className="animate-pulse space-y-4 divide-y divide-onyx-300 rounded border border-onyx-300 p-4 dark:divide-onyx-700 dark:border-onyx-700 md:p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
        <div className="h-2 w-32 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
        <div className="h-2 w-32 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
        <div className="h-2 w-32 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-onyx-300 dark:bg-onyx-700"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);
