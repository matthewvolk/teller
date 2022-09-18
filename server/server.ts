import Express, { Request, Response } from 'express';
const app = Express();
const port = process.env.PORT ?? 1337;

app.get('/time', (_req: Request, res: Response) => {
  res.json({ time: new Date() });
});

app.listen(port, () => {
  console.log(`🚀 Teller.sh listening at http://localhost:${port}`);
});
