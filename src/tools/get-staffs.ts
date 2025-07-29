import { BaseTool } from "../utils/base-tool.js";
import { freispaceClient } from "../utils/http-client.js";

const TOOL_NAME = "staffs_query";
const TOOL_DESCRIPTION = `
"Use this tool when the user requests information about staff members—e.g., mentions /staff, or asks for a list of employees, their roles, or other related information.

When to use this tool:
1. When user types "/staff" command (e.g., "/staff")
2. When user asks for a list of employees, their roles, or other related information (e.g., "Who are the staff members?", "List all employees", "What roles do we have in the company?")

Each result includes:
- Name of the staff member
- Title or role
- Number of the staff member
"
`;

export class GetStaffsTool extends BaseTool {
  name = TOOL_NAME;
  description = TOOL_DESCRIPTION;

  async execute() {
    try {
      const response = await freispaceClient.get("/tools/analytics/get-staffs");

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error executing tool", error);
      throw error;
    }
  }
}
