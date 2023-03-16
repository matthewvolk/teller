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
    <button
      onClick={() => open()}
      disabled={!ready}
      className="rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-500/5 hover:text-slate-900"
    >
      Link Bank Account
    </button>
  );
};
