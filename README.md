# Customer Refund MCP Server

A custom Model Context Protocol (MCP) server built using TypeScript, the official MCP SDK, and Zod. It provides customer lookup and simulated refund processing through STDIO transport.

## Features

- Two MCP tools: `get_customer_record` and `trigger_refund`
- Strict input validation using Zod
- JSON-RPC error handling for invalid tool arguments
- STDIO transport for MCP client communication
- Mock customer records and simulated refund processing
- Logging to stderr to keep stdout reserved for MCP communication

## Technologies

- TypeScript
- Node.js
- Official Model Context Protocol SDK
- Zod
- MCP Inspector

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ashritharao485/customer-refund-mcp-server.git
cd customer-refund-mcp-server
npm install
```

## Build and Run

Compile the TypeScript source:

```bash
npm run build
```

Start the server:

```bash
npm start
```

The server communicates through STDIO and waits for MCP client requests.

## Available Tools

### 1. get_customer_record

Retrieves a customer record using a customer ID.

**Input:**

```json
{
  "customer_id": "CUST-12345"
}
```

**Example response:**

```json
{
  "customer_id": "CUST-12345",
  "name": "John Smith",
  "email": "john@example.com",
  "account_status": "Active"
}
```

### 2. trigger_refund

Simulates a refund for an existing customer.

**Input:**

```json
{
  "customer_id": "CUST-12345",
  "amount": 100.5,
  "reason": "Duplicate payment"
}
```

**Example response:**

```json
{
  "refund_id": "REF-generated-uuid",
  "customer_id": "CUST-12345",
  "amount": 100.5,
  "reason": "Duplicate payment",
  "status": "PROCESSED"
}
```

Refunds are simulated and stored in memory. No real payments are processed.

## Input Validation

- Customer IDs must match `CUST-XXXXX`, where X is a digit.
- Refund amounts must be positive, finite numbers.
- Refund reasons must contain at least 10 characters.
- Invalid tool arguments are rejected with MCP validation errors.
- Unknown customers return tool-level error results.

## Testing

The server was manually tested using MCP Inspector.

Start the Inspector:

```bash
npx @modelcontextprotocol/inspector
```

Configure the connection using STDIO with:

- Command: `node`
- Arguments: `dist/index.js`
- Working directory: the project root

The following scenarios were tested:

- Valid customer lookup
- Invalid customer ID format
- Valid refund processing
- Negative and zero refund amounts
- Refund reasons shorter than 10 characters
- Invalid customer IDs during refund processing

## Project Structure

```text
customer-mcp-server/
├── src/
│   └── index.ts
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Notes

This project uses mock customer data and in-memory refund storage for demonstration purposes. Refund records do not persist after the server stops.