import type { ServerResponse } from 'node:http';
import { getQueryParam, sendJson, type ServerlessRequest } from '../_lib/http';
import { fetchGithubContributions } from '../_lib/portfolioCore';

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
    const payload = await fetchGithubContributions(forceSync);
    if (!payload) {
      sendJson(res, 502, {
        error: 'Unable to fetch GitHub contribution calendar right now.',
      });
      return;
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    sendJson(res, 200, payload);
  } catch {
    sendJson(res, 500, { error: 'Failed to load GitHub contributions.' });
  }
}
