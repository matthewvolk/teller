import * as React from "react";
import { Html } from "@react-email/html";
import { Container } from "@react-email/container";
import { Text } from "@react-email/text";
import { type AccountBase } from "plaid";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Email: React.FC<{ accounts: AccountBase[] }> = ({ accounts }) => {
  return (
    <Html lang="en">
      <Container
        style={{
          backgroundColor: "rgb(248, 250, 252)",
          color: "rgb(15, 23, 42)",
          minHeight: "100vh",
        }}
      >
        <Text
          style={{
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            margin: "0 0 0.5rem 0",
          }}
        >
          Good morning! 👋
        </Text>
        {accounts.map((account) => (
          <>
            <Text style={{ margin: "1.25rem 0 0.5rem 0" }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  lineHeight: "1.75rem",
                }}
              >
                Account: {account.name}{" "}
                <span
                  style={{
                    fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    padding: "0.25rem",
                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                    borderRadius: "0.25rem",
                    fontWeight: 500,
                  }}
                >
                  {account.mask}
                </span>
              </span>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.5rem",
                  maxWidth: "24rem",
                }}
              >
                <p style={{ margin: "0" }}>Current Balance:</p>
                <p
                  style={{
                    margin: "0",
                    color: "rgb(22 163 74)",
                    fontWeight: 500,
                    fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                  }}
                >
                  {usd.format(account.balances.current as number)}
                </p>
                <p style={{ margin: "0" }}>Available Balance:</p>
                <p
                  style={{
                    margin: "0",
                    color: "rgb(22 163 74)",
                    fontWeight: 500,
                    fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                  }}
                >
                  {usd.format(account.balances.available as number)}
                </p>
              </div>
            </Text>
          </>
        ))}
      </Container>
    </Html>
  );
};
