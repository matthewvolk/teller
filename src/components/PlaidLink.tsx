import { api } from "@/utils/api";
import { usePlaidLink } from "react-plaid-link";

export const PlaidLink: React.FC<{ linkToken: string }> = ({ linkToken }) => {
  const utils = api.useContext();

  const setAccessToken = api.plaid.setAccessToken.useMutation();

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log("metadata", metadata);

      setAccessToken.mutate(
        { publicToken: public_token },
        {
          onSuccess: () => {
            void utils.plaid.getAccountData.invalidate();
          },
        }
      );
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      [Link Bank Account]
    </button>
  );
};
