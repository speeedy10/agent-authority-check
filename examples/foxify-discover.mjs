const alias = "io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight";
const registry = new URL("https://registry.modelcontextprotocol.io/v0.1/servers");
registry.searchParams.set("version", "latest");
registry.searchParams.set("limit", "100");
registry.searchParams.set("search", "payment-preflight");

const listing = await (await fetch(registry)).json();
const entry = (listing.servers || []).find(x => x && x.server && x.server.name === alias);
if (!entry) throw new Error("FOXIFY not found in Official MCP Registry search");

const remote = (entry.server.remotes || []).find(x => x.type === "streamable-http")?.url;
if (!remote) throw new Error("No Streamable HTTP remote");

function decodeBody(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const data = trimmed
    .split("\n")
    .filter(line => line.startsWith("data:"))
    .map(line => line.slice(5).trim())
    .join("");

  if (!data) throw new Error("MCP response did not contain JSON or SSE data");
  return JSON.parse(data);
}

async function rpc(id, method, params = {}) {
  const response = await fetch(remote, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json, text/event-stream",
      "mcp-protocol-version": "2025-11-25"
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params })
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(method + ": HTTP " + response.status + ": " + text);
  }
  return decodeBody(text);
}

const initialized = await rpc(1, "initialize", {
  protocolVersion: "2025-11-25",
  capabilities: {},
  clientInfo: {
    name: "foxify-zero-dependency-discovery",
    version: "1.0.0"
  }
});

const tools = await rpc(2, "tools/list");
const info = await rpc(3, "tools/call", {
  name: "foxify_preflight_info",
  arguments: {}
});

const infoText = (((info.result || {}).content || []).find(x => x.type === "text") || {}).text || "{}";

console.log(JSON.stringify({
  registryQuery: "payment-preflight",
  discovered: entry.server.name,
  remote,
  server: initialized.result && initialized.result.serverInfo,
  tools: ((tools.result && tools.result.tools) || []).map(tool => tool.name),
  info: JSON.parse(infoText)
}, null, 2));
