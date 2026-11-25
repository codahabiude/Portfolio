import type { ServerResponse } from 'node:http';
import {
  getClientIp,
  readJsonBody,
  sendJson,
  type ServerlessRequest,
} from './_lib/http.js';
import {
  createInquiryRecord,
  isRateLimited,
  validateInquiryInput,
} from './_lib/portfolioCore.js';

export default async function handler(
  req: ServerlessRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }
  if (isRateLimited(getClientIp(req))) {
    sendJson(res, 429, {
      error: 'Too many project requests from this address. Please wait a few minutes.',
    });
    return;
  }

  let body: Record<string, unknown> | undefined;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 413, { error: 'Request payload is too large.' });
    return;
  }

  const validated = validateInquiryInput(body);
  if ('error' in validated) {
    sendJson(res, 400, { error: validated.error });
    return;
  }

  try {
    const created = await createInquiryRecord(validated);
    sendJson(res, 201, created);
  } catch {
    sendJson(res, 500, { error: 'Unable to submit your inquiry right now.' });
  }
}
