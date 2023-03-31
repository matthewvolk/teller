import { Theme } from "@/components/Theme";
import { api } from "@/utils/api";
import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

const Dashboard: NextPage = () => {
  const privateHello = api.hello.privateHello.useQuery({ text: "from tRPC" });

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
        <p>
          {privateHello.data
            ? privateHello.data.greeting
            : "Loading tRPC query..."}
        </p>
      </main>
    </>
  );
};

export default Dashboard;
