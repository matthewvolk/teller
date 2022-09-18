# Teller.sh

An email service for money management

## Getting Started

1. Prerequisites:
   1. Node `>= v18.6`
   2. NPM `>= v8.13.2`
   3. Docker `>= 20.10.17`
   4. Docker Compose `>= v2.6.1`
2. Fork and clone this project
3. `cd` into the cloned directory
4. Update `.git/config` if necessary
5. Local Development:
   1. Install dependencies: `npm i`
   2. Run: `chmod +x ./shell/*.sh`
   3. Start containers: `./shell/up.sh`
   4. (In a new terminal window) Start Next.js `cd client && npm i && npm run dev`
   5. Visit: [`http://localhost:3000`](http://localhost:3000)
   6. Press `CTRL+C` to shut down gracefully
6. Clean up and start fresh:
   1. Clean: `./shell/clean.sh`
   2. Start containers: `./shell/up.sh`
