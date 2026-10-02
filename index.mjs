#!/usr/bin/env node
import fs from 'node:fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const tools = JSON.parse(fs.readFileSync(new URL('./tools.json', import.meta.url), 'utf8'));
const MAX_ITEMS = 50, MAX_CHARS = 20000;
const server = new Server({ name: 'honestkit-mcp', version: '0.1.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(t => ({ name: t.name, description: t.description + ` (Billed pay-per-event to your Apify account; see https://apify.com/forevertools/${t.actor})`, inputSchema: t.inputSchema })),
}));

const text = (t, isError = false) => ({ content: [{ type: 'text', text: t }], isError });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = tools.find(t => t.name === req.params.name);
  if (!tool) return text(`Unknown tool: ${req.params.name}`, true);
  const token = process.env.APIFY_TOKEN;
  if (!token) return text('APIFY_TOKEN environment variable is not set. Set it to your Apify API token; runs are billed to your Apify account.', true);
  const url = `https://api.apify.com/v2/acts/forevertools~${tool.actor}/run-sync-get-dataset-items`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(req.params.arguments || {}),
    });
    const body = await res.text();
    if (!res.ok) return text(`Apify API error ${res.status}: ${body.slice(0, 2000)}`, true);
    let items; try { items = JSON.parse(body); } catch { return text(body.slice(0, MAX_CHARS)); }
    if (!Array.isArray(items)) return text(JSON.stringify(items, null, 2).slice(0, MAX_CHARS));
    const total = items.length;
    let shown = items.slice(0, MAX_ITEMS);
    let out = JSON.stringify(shown, null, 1), note = '';
    while (out.length > MAX_CHARS && shown.length > 1) { shown = shown.slice(0, Math.ceil(shown.length / 2)); out = JSON.stringify(shown, null, 1); }
    if (out.length > MAX_CHARS) out = out.slice(0, MAX_CHARS);
    if (shown.length < total || out.length >= MAX_CHARS) note = `\n\n[Truncated: showing ${shown.length} of ${total} items. Narrow the input or use the Apify console for the full dataset.]`;
    return text(out + note);
  } catch (e) { return text(`Request failed: ${e.message}`, true); }
});

await server.connect(new StdioServerTransport());
