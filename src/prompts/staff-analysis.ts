import { z } from "zod";
import { BasePrompt } from "../utils/base-prompt.js";

const staffAnalysisSchema = z.object({
  analysis_type: z
    .enum(["overview", "collaboration", "role_distribution", "team_dynamics"])
    .describe("The type of staff analysis to perform"),
  staff_name: z
    .string()
    .optional()
    .describe("Optional: Focus analysis on a specific staff member"),
});

export class StaffAnalysisPrompt extends BasePrompt {
  name = "staff_analysis";
  description =
    "Generate comprehensive prompts for analyzing staff data, collaboration patterns, and organizational insights";
  schema = staffAnalysisSchema;

  async execute(args?: z.infer<typeof staffAnalysisSchema>) {
    const analysisType = args?.analysis_type || "overview";
    const staffName = args?.staff_name;

    let promptText = "";
    let description = "";

    switch (analysisType) {
      case "overview":
        description = "Comprehensive staff overview analysis";
        promptText = `You are an expert organizational analyst. Please analyze the staff directory data and provide insights on:

1. **Team Composition**: 
   - Total number of staff members
   - Role distribution and organizational structure
   - Key positions and responsibilities

2. **Skills and Expertise**:
   - Different professional roles represented
   - Specialization areas (technical, creative, administrative)
   - Potential skill gaps or strengths

3. **Organizational Insights**:
   - Team diversity in roles and functions
   - Reporting structure implications
   - Resource allocation patterns

Please provide a professional summary that would be useful for management decisions, team planning, and organizational development.

Use the /staff command to retrieve the current staff directory, then analyze the data comprehensively.`;
        break;

      case "collaboration":
        description = staffName
          ? `Collaboration analysis for ${staffName}`
          : "Team collaboration patterns analysis";
        promptText = staffName
          ? `You are an expert in workplace collaboration analysis. Please analyze the collaboration patterns for **${staffName}** and provide insights on:

1. **Collaboration Network**:
   - Who does ${staffName} work with most frequently?
   - What types of projects bring them together?
   - Key working relationships and partnerships

2. **Project Involvement**:
   - Types of bookings and projects ${staffName} participates in
   - Cross-functional collaboration patterns
   - Role in team dynamics

3. **Professional Network**:
   - Colleagues from different departments/roles
   - Frequency and nature of collaborations
   - Potential opportunities for expanded collaboration

4. **Recommendations**:
   - Ways to enhance collaboration effectiveness
   - Potential new partnerships to explore
   - Skills or knowledge sharing opportunities

Use the staffs_worked_together_query tool with "${staffName}" to get detailed collaboration data, then provide actionable insights.`
          : `You are an expert in organizational collaboration analysis. Please analyze team collaboration patterns and provide insights on:

1. **Overall Collaboration Patterns**:
   - How do different roles work together?
   - Cross-functional team dynamics
   - Communication and workflow patterns

2. **Project-Based Analysis**:
   - Common project types and team compositions
   - Recurring partnerships and working relationships
   - Resource allocation across projects

3. **Network Analysis**:
   - Key connectors and collaboration hubs
   - Isolated or under-connected team members
   - Department/role interaction patterns

4. **Improvement Opportunities**:
   - Ways to enhance cross-team collaboration
   - Knowledge sharing improvements
   - Team building recommendations

Start by using /staff to get the staff directory, then analyze collaboration patterns using the staffs_worked_together_query tool for key team members.`;
        break;

      case "role_distribution":
        description =
          "Analysis of role distribution and organizational structure";
        promptText = `You are an expert in organizational structure analysis. Please analyze the role distribution in the organization and provide insights on:

1. **Role Categories**:
   - Technical roles (Kameramann, Toningenieur, Tontechniker, etc.)
   - Creative roles (Autor, Autorin, etc.)
   - Specialized functions and their distribution

2. **Team Balance**:
   - Are there appropriate ratios between different role types?
   - Potential bottlenecks or resource constraints
   - Coverage across different skill areas

3. **Organizational Structure**:
   - How roles complement each other
   - Workflow and process implications
   - Hierarchy and reporting considerations

4. **Strategic Recommendations**:
   - Areas where additional resources might be needed
   - Role consolidation or expansion opportunities
   - Skills development priorities

5. **Industry Context**:
   - How this structure fits typical media/production organizations
   - Best practices for similar team compositions
   - Scalability considerations

Use the /staff command to retrieve current role distribution data and provide a strategic analysis.`;
        break;

      case "team_dynamics":
        description = "Analysis of team dynamics and working relationships";
        promptText = `You are an expert in team dynamics and organizational psychology. Please analyze the team structure and working relationships to provide insights on:

1. **Team Interaction Patterns**:
   - How do different roles collaborate naturally?
   - Communication flows and dependencies
   - Cross-functional project requirements

2. **Collaboration Effectiveness**:
   - Strong working partnerships
   - Potential collaboration gaps
   - Team synergy opportunities

3. **Organizational Health**:
   - Team diversity and inclusion patterns
   - Knowledge sharing and mentorship opportunities
   - Professional development pathways

4. **Workflow Optimization**:
   - How team structure supports project delivery
   - Potential process improvements
   - Resource allocation efficiency

5. **Recommendations**:
   - Team building initiatives
   - Communication improvement strategies
   - Professional development planning

Start with /staff to understand the team composition, then use collaboration data to analyze working relationships and team effectiveness.`;
        break;

      default:
        description = "General staff analysis";
        promptText =
          "Please analyze the staff data and provide relevant organizational insights.";
    }

    return {
      description,
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: promptText,
          },
        },
      ],
    };
  }
}
