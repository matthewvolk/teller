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
        <Container className="mx-auto bg-neutral-900 font-mono text-white">
          <Text>
            <h1 className="mb-8 text-base font-normal">g&apos;morn</h1>
          </Text>
          {accounts.map((account) => (
            <>
              <Text className="m-0">
                <span className="m-0">
                  Account: {account.name} {account.mask}
                </span>

                <div className="mb-8 grid max-w-sm grid-cols-2">
                  <p className="my-0.5 text-sm">Current Balance:</p>
                  <p className="my-0.5 text-sm text-green-600">
                    {usd.format(account.balances.current as number)}
                  </p>
                  <p className="my-0.5 text-sm">Available Balance:</p>
                  <p className="my-0.5 text-sm text-green-600">
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
