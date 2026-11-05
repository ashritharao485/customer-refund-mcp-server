
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { randomUUID } from "node:crypto";

// Validate customer IDs in the format CUST-XXXXX
const customerIdSchema = z.string().regex(
  /^CUST-\d{5}$/,
  "Customer ID must follow the format CUST-XXXXX"
);

// Sample customer records
const customers = [
  {
    customer_id: "CUST-12345",
    name: "John Smith",
    email: "john@example.com",
    account_status: "Active"
  },
  {
    customer_id: "CUST-67890",
    name: "Jane Doe",
    email: "jane@example.com",
    account_status: "Active"
  }
];

// Store simulated refunds while the server is running
const refunds: Array<{
  refund_id: string;
  customer_id: string;
  amount: number;
  reason: string;
  status: string;
}> = [];

const server = new McpServer({
  name: "customer-refund-mcp-server",
  version: "1.0.0"
});

// Tool 1: Get customer record
server.registerTool(
  "get_customer_record",
  {
    description: "Retrieve a customer record by customer ID.",
    inputSchema: {
      customer_id: customerIdSchema
    }
  },
  async ({ customer_id }) => {
    const customer = customers.find(
      (record) => record.customer_id === customer_id
    );

    if (!customer) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Customer ${customer_id} was not found.`
          }
        ],
        isError: true
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(customer, null, 2)
        }
      ]
    };
  }
);

// Tool 2: Trigger refund
server.registerTool(
  "trigger_refund",
  {
    description: "Simulate a refund for an existing customer.",
    inputSchema: {
      customer_id: customerIdSchema,
      amount: z.number().finite().positive(),
      reason: z.string().trim().min(10)
    }
  },
  async ({ customer_id, amount, reason }) => {
    const customer = customers.find(
      (record) => record.customer_id === customer_id
    );

    if (!customer) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Customer ${customer_id} was not found.`
          }
        ],
        isError: true
      };
    }

    const refund = {
      refund_id: `REF-${randomUUID()}`,
      customer_id,
      amount,
      reason,
      status: "PROCESSED"
    };

    refunds.push(refund);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(refund, null, 2)
        }
      ]
    };
  }
);

// Start the MCP server using STDIO transport
async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Logs must go to stderr, never stdout
  console.error("Customer Refund MCP Server started.");
}

main().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
