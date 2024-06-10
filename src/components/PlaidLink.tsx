"use client";

import { usePlaidLink } from "react-plaid-link";

import { exchangePublicToken } from "@/actions/exchange-public-token";

export const PlaidLink = ({ linkToken }: { linkToken: string }) => {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      await exchangePublicToken.call(null, publicToken);
    },
  });

  return (
    <button className="w-fit" disabled={!ready} onClick={() => open()}>
      Link an Account
    </button>
  );
};
