import cors from 'cors';
import Express from 'express';

import { initPostgres } from './database';
import { jsonErrors } from './middleware/jsonErrors';
import router from './routes';

(async () => {
  const app = Express();
  const port = process.env.PORT ?? 1337;

  await initPostgres();

  app.use(cors());
  app.use(Express.json());

  app.use('/', router);

  app.use(jsonErrors);

  app.listen(port, () => {
    console.log(`🚀 Teller.sh listening at http://localhost:${port}`);
  });
})();
