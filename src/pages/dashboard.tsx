import { Theme } from "@/components/Theme";
import { api } from "@/utils/api";
import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";

const Dashboard: NextPage = () => {
  const [activeMenu, setActiveMenu] = useState<"accounts" | "transactions">(
    "accounts"
  );

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

      <main className="flex h-screen gap-4">
        <section className="flex h-screen basis-1/5 flex-col justify-between border-r bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <div className="px-4 py-6">
            <span className="grid h-10 w-32 place-content-center rounded-lg bg-neutral-100 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
              Dashboard
            </span>

            <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
              <button
                onClick={() => setActiveMenu("accounts")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${
                  activeMenu === "accounts"
                    ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 opacity-75"
                  stroke-width="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>

                <span className="text-sm font-medium"> Accounts </span>
              </button>

              <button
                onClick={() => setActiveMenu("transactions")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${
                  activeMenu === "transactions"
                    ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>

                <span className="text-sm font-medium"> Transactions </span>
              </button>
            </nav>
          </div>

          <div className="sticky inset-x-0 bottom-0 flex justify-between border-t dark:border-neutral-700">
            <div className="p-4">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="p-4">
              <Theme />
            </div>
          </div>
        </section>

        <section className="grow overflow-scroll px-4 py-6">
          <ActiveMenu activeMenu={activeMenu} />
        </section>
      </main>
    </>
  );
};

interface ActiveMenuProps {
  activeMenu: "accounts" | "transactions";
}

const ActiveMenu: React.FC<ActiveMenuProps> = ({ activeMenu }) => {
  switch (activeMenu) {
    case "accounts":
      return <Accounts />;
    case "transactions":
      return <Transactions />;
    default:
      return <div>Error in ActiveMenu</div>;
  }
};

const Accounts = () => {
  const accountsWithInstitution = api.plaid.accountsWithInstitution.useQuery();
  const createLinkToken = api.plaid.createLinkToken.useQuery();

  return (
    <>
      <h1 className="text-medium mb-4 text-2xl">Link Account</h1>
      <p>{createLinkToken.isLoading && "Loading..."}</p>
      <p>{createLinkToken.isError && createLinkToken.error.message}</p>
      <p>
        {createLinkToken.isSuccess && (
          <Link linkToken={createLinkToken.data.link_token} />
        )}
      </p>

      <br />
      <h1 className="text-medium mb-4 text-2xl">Accounts</h1>
      <p>{accountsWithInstitution.isLoading && "Loading..."}</p>
      <p>
        {accountsWithInstitution.isError &&
          accountsWithInstitution.error.message}
      </p>
      <div className="overflow-hidden rounded-md border dark:border-neutral-700">
        <table className="w-full table-auto dark:border-neutral-700">
          <thead className="bg-neutral-100 text-left text-xs uppercase dark:bg-neutral-800">
            <tr className="border-b dark:border-neutral-700">
              <th className="px-6 py-3">Institution</th>
              <th className="px-6 py-3">Account</th>
              <th className="px-6 py-3">Mask</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Current Balance</th>
              <th className="px-6 py-3">Available Balance</th>
            </tr>
          </thead>
          <tbody>
            {accountsWithInstitution.isSuccess &&
              accountsWithInstitution.data.map((account, i) => (
                <tr
                  key={account.account_id}
                  className={`border-b dark:border-neutral-700 ${
                    i % 2 ? "bg-neutral-50 dark:bg-neutral-800/60" : ""
                  }`}
                >
                  <td className="px-6 py-3">{account.institution_name}</td>
                  <td className="px-6 py-3">{account.name}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-md bg-neutral-100 px-1 py-0.5 font-mono text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50">
                      {account.mask}
                    </span>
                  </td>
                  <td className="px-6 py-3">{account.subtype}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-md bg-green-100/75 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
                      $ {account.balances.current?.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="rounded-md bg-green-100/75 px-1 py-0.5 text-green-800 dark:bg-green-800/75 dark:text-green-50">
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
    start: "2023-03-30",
    end: "2023-04-04",
  });

  return (
    <>
      <h1 className="text-medium mb-4 text-2xl">Transactions</h1>
      <p>{transactions.isLoading && "Loading..."}</p>
      <p>{transactions.isError && transactions.error.message}</p>
      {transactions.isSuccess &&
        transactions.data.map((transaction, i) => (
          <pre key={i} className="text-sm">
            {JSON.stringify(transaction, null, 2)}
          </pre>
        ))}
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
            void ctx.plaid.accountsWithInstitution.invalidate();
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
