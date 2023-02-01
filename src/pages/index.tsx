import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  if (session.status === "authenticated") {
    void router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Teller - An email service for money management</title>
        <meta
          name="description"
          content="Teller - An email service for money management"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto p-4">
        <header>
          <nav className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Teller</h1>
            <button
              onClick={() => void signIn()}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white"
            >
              Sign in
            </button>
          </nav>
        </header>
      </main>
    </>
  );
}
