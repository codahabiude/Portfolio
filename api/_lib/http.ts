import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface ServerlessRequest extends IncomingMessage {
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export function sendJson(res: ServerResponse, statusCode: number, data: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.end(JSON.stringify(data));
}

export function getQueryParam(req: ServerlessRequest, key: string): string {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === 'string') return fromQuery;
  if (Array.isArray(fromQuery) && typeof fromQuery[0] === 'string') return fromQuery[0];
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    return url.searchParams.get(key) ?? '';
  } catch {
    return '';
  }
}

export function getProjectIdFromReq(req: ServerlessRequest): string {
  const fromQuery = getQueryParam(req, 'id');
  if (fromQuery) return fromQuery;
  const match = (req.url || '').match(/\/api\/projects\/([^/?#]+)\//);
  return match ? decodeURIComponent(match[1]) : '';
}

export function getClientIp(req: ServerlessRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export async function readJsonBody(
  req: ServerlessRequest
): Promise<Record<string, unknown> | undefined> {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > 32 * 1024) {
      throw new Error('Payload too large');
    }
    chunks.push(buf);
  }
  if (chunks.length === 0) return undefined;
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
  } catch {
    return undefined;
  }
}
