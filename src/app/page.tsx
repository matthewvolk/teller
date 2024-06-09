import { db } from "@/db";

export default async function Home() {
  const banks = await db.query.banks.findMany();

  return (
    <main>
      <h1>Banks</h1>
      <ul>
        {banks.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
