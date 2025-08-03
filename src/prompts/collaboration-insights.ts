import { z } from "zod";
import { BasePrompt } from "../utils/base-prompt.js";

const collaborationInsightsSchema = z.object({
  focus_area: z
    .enum(["individual", "team", "project", "skills"])
    .describe("The focus area for collaboration insights"),
  person_name: z
    .string()
    .optional()
    .describe("Optional: Name of person to focus on (for individual analysis)"),
  time_frame: z
    .enum(["recent", "historical", "trends"])
    .optional()
    .describe("Optional: Time frame perspective for the analysis"),
});

export class CollaborationInsightsPrompt extends BasePrompt {
  name = "collaboration_insights";
  description =
    "Generate detailed prompts for analyzing collaboration patterns, team dynamics, and project relationships";
  schema = collaborationInsightsSchema;

  async execute(args?: z.infer<typeof collaborationInsightsSchema>) {
    const focusArea = args?.focus_area || "team";
    const personName = args?.person_name;
    const timeFrame = args?.time_frame || "recent";

    let promptText = "";
    let description = "";

    switch (focusArea) {
      case "individual":
        description = personName
          ? `Individual collaboration analysis for ${personName}`
          : "Individual collaboration analysis";
        promptText = personName
          ? `You are a professional development consultant specializing in workplace collaboration. Please provide a comprehensive collaboration analysis for **${personName}**:

## Analysis Framework:

### 1. **Collaboration Profile**
- Professional role and primary responsibilities
- Key skills and expertise areas
- Current position in the team structure

### 2. **Working Relationships**
- Direct collaborators and frequent partners
- Cross-functional relationships
- Project-based vs. ongoing partnerships

### 3. **Project Involvement**
- Types of projects and assignments
- Role in different project types
- Contribution patterns and responsibilities

### 4. **Professional Network**
- Breadth of internal connections
- Diversity of collaborative relationships
- Influence and knowledge sharing patterns

### 5. **Development Opportunities**
- Potential new collaboration areas
- Skills that could be shared or developed
- Leadership and mentoring possibilities

### 6. **Recommendations**
- Career development suggestions
- Collaboration enhancement strategies
- Team contribution optimization

**Instructions**: Use the staffs_worked_together_query tool for "${personName}" to gather detailed collaboration data, then provide actionable insights for professional development and team effectiveness.`
          : `You are a professional development consultant. Please analyze individual collaboration patterns in the organization:

## Analysis Framework:

### 1. **Individual Profiles**
- Role-based collaboration tendencies
- Skills and expertise distribution
- Professional development paths

### 2. **Collaboration Styles**
- Different approaches to teamwork
- Communication and working preferences
- Contribution patterns by role

### 3. **Network Analysis**
- Key connectors and team bridges
- Specialists vs. generalists
- Knowledge sharing leaders

**Instructions**: Start with /staff to identify team members, then use collaboration tools to analyze individual working patterns and development opportunities.`;
        break;

      case "team":
        description = "Team collaboration dynamics analysis";
        promptText = `You are an organizational effectiveness expert. Please analyze team collaboration dynamics and provide strategic insights:

## Team Collaboration Analysis:

### 1. **Team Structure Assessment**
- Role distribution and team composition
- Skill complementarity and gaps
- Communication pathways and hierarchies

### 2. **Collaboration Patterns**
- Cross-functional project teams
- Recurring partnerships and workflows
- Department interaction frequencies

### 3. **Project-Based Analysis**
- How teams form for different project types
- Resource allocation and workload distribution
- Success patterns in team formations

### 4. **Communication & Knowledge Flow**
- Information sharing effectiveness
- Knowledge transfer mechanisms
- Documentation and collaboration tools usage

### 5. **Team Effectiveness Metrics**
- Collaboration frequency and quality
- Project success correlation with team composition
- Bottlenecks and process improvements

### 6. **Strategic Recommendations**
- Team structure optimizations
- Process improvements for better collaboration
- Professional development and training needs
- Communication enhancement strategies

**Instructions**: Begin with /staff for team overview, then analyze multiple collaboration patterns using the staffs_worked_together_query tool to map team dynamics comprehensively.`;
        break;

      case "project":
        description = "Project-based collaboration analysis";
        promptText = `You are a project management consultant specializing in team dynamics. Please analyze project-based collaboration patterns:

## Project Collaboration Analysis:

### 1. **Project Types & Team Composition**
- Common project categories and required roles
- Team size and structure patterns
- Skill mix requirements for different projects

### 2. **Collaboration Workflows**
- How teams are assembled for projects
- Communication and coordination patterns
- Role dependencies and critical paths

### 3. **Resource Utilization**
- Staff allocation across projects
- Utilization rates and availability patterns
- Skill deployment optimization

### 4. **Project Success Factors**
- Team combinations that work well together
- Collaboration patterns that lead to success
- Risk factors in team composition

### 5. **Process Optimization**
- Bottlenecks in project collaboration
- Opportunities for workflow improvements
- Tools and methods for better coordination

### 6. **Strategic Planning**
- Capacity planning and resource forecasting
- Team development for future projects
- Scalability and growth considerations

**Instructions**: Use /staff and collaboration analysis tools to map project-based working relationships and identify optimization opportunities.`;
        break;

      case "skills":
        description = "Skills-based collaboration analysis";
        promptText = `You are a talent development specialist focusing on skills and knowledge management. Please analyze skills-based collaboration in the organization:

## Skills Collaboration Analysis:

### 1. **Skills Inventory**
- Technical skills represented in the team
- Creative and soft skills distribution
- Specialized knowledge areas

### 2. **Knowledge Sharing Patterns**
- How skills and expertise are shared
- Mentoring and learning relationships
- Cross-training and skill development

### 3. **Skill Complementarity**
- How different skills work together on projects
- Skill gaps and redundancies
- Optimal skill combinations for different work types

### 4. **Professional Development**
- Learning and growth opportunities
- Skills transfer mechanisms
- Career development pathways

### 5. **Innovation & Creativity**
- How diverse skills drive innovation
- Cross-pollination of ideas and methods
- Creative collaboration patterns

### 6. **Strategic Skills Planning**
- Future skills needs and development priorities
- Training and recruitment recommendations
- Knowledge retention strategies

**Instructions**: Start with /staff to understand the skills landscape, then use collaboration data to analyze how skills are shared and developed through working relationships.`;
        break;

      default:
        description = "General collaboration insights";
        promptText =
          "Please analyze collaboration patterns and provide insights for organizational improvement.";
    }

    // Add time frame context if specified
    if (timeFrame !== "recent") {
      const timeFrameContext = {
        historical:
          "\n\n**Time Frame Focus**: Please consider historical patterns and long-term collaboration trends in your analysis.",
        trends:
          "\n\n**Time Frame Focus**: Please identify emerging trends and changes in collaboration patterns over time.",
      };
      promptText += timeFrameContext[timeFrame] || "";
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
