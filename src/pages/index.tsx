import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Layout } from "@/components/Layout";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1>Teller.sh</h1>
      {session && (
        <>
          <Link href="/dashboard">Go to Dashboard</Link>
          <br />
        </>
      )}
      <button onClick={session ? () => void signOut() : () => void signIn()}>
        {session ? "Sign out" : "Sign in"}
      </button>
    </Layout>
  );
};

export default Home;
