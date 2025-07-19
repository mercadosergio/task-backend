import 'reflect-metadata';
import Server from './server';

async function main() {
  const app = new Server();
  await app.listen();
}

main();
