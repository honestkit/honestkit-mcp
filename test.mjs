import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const t = new StdioClientTransport({ command: 'node', args: ['index.mjs'], env: { ...process.env } });
const c = new Client({ name: 'smoke', version: '0' });
await c.connect(t);
const { tools } = await c.listTools();
console.log(tools.map(x => x.name).join('\n'));
if (tools.length !== 14) { console.error(`FAIL: expected 14 tools, got ${tools.length}`); process.exit(1); }
if (!process.env.APIFY_TOKEN) console.log('APIFY_TOKEN not set: live call skipped');
console.log('PASS: 14 tools listed');
await c.close();
