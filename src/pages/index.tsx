import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Theme } from "@/components/Theme";

const Home: NextPage = () => {
  const publicHello = api.hello.publicHello.useQuery({ text: "from tRPC" });

  const user = useUser();

  return (
    <>
      <Head>
        <title>Teller</title>
        <meta
          name="description"
          content="Teller is an email service for money management"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="container mx-auto p-4">
        <nav className="flex items-center justify-between pb-4">
          <h1>Teller.sh</h1>
          <div className="flex items-center gap-2">
            <Theme />
            {user.isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
                <Link href="/dashboard">Dashboard</Link>
              </>
            ) : (
              <SignInButton redirectUrl="/dashboard" />
            )}
          </div>
        </nav>
        <p>
          {publicHello.data
            ? publicHello.data.greeting
            : "Loading tRPC query..."}
        </p>
      </main>
    </>
  );
};

export default Home;
