import { PlaidLink } from '@/components/PlaidLink';
import { trpc } from '../utils/trpc';

export default function Home() {
  const linkToken = trpc.linkToken.useQuery();

  return <>{linkToken.isSuccess && <PlaidLink linkToken={linkToken.data} />}</>;
}
