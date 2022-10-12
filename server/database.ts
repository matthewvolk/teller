import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { MoneyToken } from './models/MoneyToken';
import { User } from './models/User';

const postgres = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === 'heroku' ? { ssl: { rejectUnauthorized: false } } : {}),
  entities: [MoneyToken, User],
  logging: true,

  /**
   * @todo disable synchronize in production
   */
  synchronize: true,
});

export const initPostgres = async () => {
  let retries = 10;

  while (retries) {
    try {
      await postgres.initialize();
      retries = 0;
    } catch (err) {
      console.log(err);
      await new Promise((res) => setTimeout(res, 5000));
      retries -= 1;
    }
  }

  return postgres;
};

export default postgres;
