import * as fs from 'fs';
import { OrderFileParser } from '../src/core/parser';

const filePath = process.argv[2] || 'assets/pedidos.txt';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    process.exit(1);
  }
  const parsed = OrderFileParser.parseFileContent(data);
  console.log(JSON.stringify(parsed, null, 2));
});