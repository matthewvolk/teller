import Link from "next/link";

export default function Home() {
  return (
    <>
      <header>
        <Link href="/">Teller</Link>
      </header>
      <main>
        <h1>Home</h1>
      </main>
      <footer>&copy; {new Date().getFullYear()} Teller</footer>
    </>
  );
}
