import * as React from "react";
import { Html } from "@react-email/html";
import { Container } from "@react-email/container";
import { Text } from "@react-email/text";
import { type AccountBase } from "plaid";

export const Email: React.FC<{ accounts: AccountBase[] }> = ({ accounts }) => {
  return (
    <Html lang="en">
      <Container style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}>
        <Text>Hello</Text>
        <Text>Here are your accounts:</Text>
        {accounts.map((account) => (
          <>
            <Text>
              Account: {account.official_name} Current Balance:{" "}
              {account.balances.current} Available Balance:{" "}
              {account.balances.available}
            </Text>
          </>
        ))}
      </Container>
    </Html>
  );
};
