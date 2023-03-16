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
      <main>
        <header>
          <button onClick={() => void signIn()}>[Sign in]</button>
        </header>
      </main>
    </>
  );
}
