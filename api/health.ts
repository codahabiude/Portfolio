import type { ServerResponse } from 'node:http';
import { sendJson, type ServerlessRequest } from './_lib/http';

export default function handler(req: ServerlessRequest, res: ServerResponse): void {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }
  sendJson(res, 200, { ok: true, timestamp: new Date().toISOString() });
}
