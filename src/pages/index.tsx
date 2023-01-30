import { PlaidLink } from '@/components/PlaidLink';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';

export default function Home() {
  const { data: session } = useSession();
  const linkToken = trpc.linkToken.useQuery();

  if (session) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-extrabold">Teller</h1>
          <div className="mr-4 flex items-center">
            <p className="mr-4">Signed in as {session.user?.email}</p>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
        {linkToken.isSuccess && <PlaidLink linkToken={linkToken.data} />}
      </main>
    );
  }

  return (
    <main className="container mx-auto flex justify-between p-4">
      <h1 className="text-2xl font-extrabold">Teller</h1>
      <button onClick={() => signIn()}>Sign in</button>
    </main>
  );
}
