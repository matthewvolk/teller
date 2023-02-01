import * as React from "react";
import { Html } from "@react-email/html";
import { Container } from "@react-email/container";
import { Text } from "@react-email/text";
import { type AccountBase } from "plaid";
import { Tailwind } from "@react-email/tailwind";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Email: React.FC<{ accounts: AccountBase[] }> = ({ accounts }) => {
  return (
    <Tailwind>
      <Html lang="en">
        <Container className="bg-slate-50 text-slate-900">
          <Text>
            <h1 className="mb-8 text-center text-lg font-bold">
              Good morning! 👋
            </h1>
          </Text>
          {accounts.map((account) => (
            <>
              <Text className="mx-4">
                <span className="m-0 mb-0.5 text-lg font-bold">
                  Account: {account.name}{" "}
                  <span className="m-0 mb-0.5 rounded bg-slate-500/10 p-1 font-mono font-medium">
                    {account.mask}
                  </span>
                </span>

                <div className="mx-4 mb-8 grid max-w-sm grid-cols-2 gap-2">
                  <p className="my-0.5">Current Balance:</p>
                  <p className="my-0.5 font-mono font-bold text-green-600">
                    {usd.format(account.balances.current as number)}
                  </p>
                  <p className="my-0.5">Available Balance:</p>
                  <p className="my-0.5 font-mono font-bold text-green-600">
                    {usd.format(account.balances.available as number)}
                  </p>
                </div>
              </Text>
            </>
          ))}
        </Container>
      </Html>
    </Tailwind>
  );
};

export default Email;
