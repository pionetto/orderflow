import { Request, Response } from 'express';
import { OrderFileParser } from '../../core/parser';
import { normalizeOrders } from '../../core/normalizer';

let lastNormalized: any[] = [];

export const uploadController = (req: Request, res: Response): void => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'Arquivo não enviado.' });
    return;
  }

  const content = file.buffer.toString('utf8');
  const parsed = OrderFileParser.parseFileContent(content);
  const normalized = normalizeOrders(parsed);

  lastNormalized = normalized;

  res.status(200).json(normalized);
};

export { lastNormalized };
