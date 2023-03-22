import { Layout } from "@/components/Layout";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Layout title="Dashboard">
      <h1>Dashboard</h1>
      {session && <p>Logged in as {session.user?.name}</p>}
      <Link href="/">Go Home</Link>
      <br />
      <button onClick={session ? () => void signOut() : () => void signIn()}>
        {session ? "Sign out" : "Sign in"}
      </button>
    </Layout>
  );
};

export default Dashboard;
