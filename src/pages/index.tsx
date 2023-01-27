import { trpc } from '../utils/trpc';

export default function Home() {
  const plaid = trpc.linkToken.useQuery();

  return (
    <>
      <pre>{plaid.isSuccess && JSON.stringify(plaid.data, null, 2)}</pre>
    </>
  );
}
