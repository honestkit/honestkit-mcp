FROM node:20-slim
LABEL io.modelcontextprotocol.server.name="io.github.honestkit/honestkit-mcp"
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY index.mjs tools.json ./
ENTRYPOINT ["node", "index.mjs"]
