import type { ServerResponse } from 'node:http';
import { getProjectIdFromReq, sendJson, type ServerlessRequest } from '../../_lib/http.js';
import { cleanText, recordProjectAppreciation } from '../../_lib/portfolioCore.js';

export default async function handler(
  req: ServerlessRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }
  const projectId = cleanText(getProjectIdFromReq(req), 64);
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    sendJson(res, 400, { error: 'Invalid project identifier.' });
    return;
  }
  try {
    const updated = await recordProjectAppreciation(projectId);
    if (!updated) {
      sendJson(res, 404, { error: 'Project not found.' });
      return;
    }
    sendJson(res, 200, updated);
  } catch {
    sendJson(res, 500, { error: 'Failed to save appreciation.' });
  }
}
