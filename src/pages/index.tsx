import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
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
      <main className="container mx-auto max-w-5xl p-8">
        <header>
          <nav className="flex items-center justify-between text-slate-900">
            <Link
              href="/"
              className="rounded p-2 text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.85}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </Link>

            <button
              onClick={() => void signIn()}
              className="rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
            >
              Sign in
            </button>
          </nav>
        </header>

        <section className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="mb-4 text-5xl font-extrabold leading-none tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Meet your personal bank teller.
          </h1>
          <h2 className="mb-4 max-w-3xl text-lg text-slate-400 md:text-xl lg:text-2xl">
            Teller sends you a daily email with the balances of all your
            financial accounts, so you never wonder where your money is.
          </h2>
        </section>
      </main>
    </>
  );
}
