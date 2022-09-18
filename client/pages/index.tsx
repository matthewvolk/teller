import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Teller.sh - An email service for money management</title>
      </Head>

      <main>
        <h1>Welcome to Teller.sh!</h1>
      </main>

      <footer>
        <p>
          <small>© Teller.sh {new Date().getFullYear()}</small>
        </p>
      </footer>
    </div>
  );
};

export default Home;
