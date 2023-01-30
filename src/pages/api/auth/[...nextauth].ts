import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

if (!process.env.GITHUB_ID) {
  throw new Error('GITHUB_ID environment variable is missing.');
}

if (!process.env.GITHUB_SECRET) {
  throw new Error('GITHUB_SECRET environment variable is missing.');
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
