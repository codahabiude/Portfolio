import type { ServerResponse } from 'node:http';
import { getQueryParam, sendJson, type ServerlessRequest } from './_lib/http';
import { getPortfolioPayload } from './_lib/portfolioCore';

export default async function handler(
  req: ServerlessRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }
  const forceSync = getQueryParam(req, 'sync') === '1';
  try {
    const payload = await getPortfolioPayload(forceSync);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    sendJson(res, 200, payload);
  } catch {
    sendJson(res, 500, { error: 'Unable to load portfolio catalog.' });
  }
}
