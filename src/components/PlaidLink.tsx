import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface Props {
  linkToken: string;
}

export const PlaidLink: React.FC<Props> = ({ linkToken }) => {
  const [data, setData] = useState('');

  const exchangeToken = trpc.exchangePublicToken.useMutation();

  const { open, exit, ready } = usePlaidLink({
    onSuccess: (public_token, metadata) => {
      console.log('metadata', metadata);
      exchangeToken.mutate(
        { publicToken: public_token },
        {
          onSuccess(data) {
            setData(JSON.stringify(data, null, 2));
          },
        }
      );
    },
    onExit: (err, metadata) => {
      console.log('err', err);
    },
    onEvent: (eventName, metadata) => {
      console.log('eventName', eventName);
    },
    token: linkToken,
  });

  return (
    <>
      <button onClick={() => open()}>Link</button>
      <pre>{data}</pre>
    </>
  );
};
