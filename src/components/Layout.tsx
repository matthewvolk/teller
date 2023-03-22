import Head from "next/head";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

interface Props {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>
          {title
            ? `${title} - Teller.sh`
            : "Teller.sh - An app for money management."}
        </title>
        <meta name="description" content="An app for money management." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className={`${workSans.variable} font-sans`}>{children}</main>
    </>
  );
};
