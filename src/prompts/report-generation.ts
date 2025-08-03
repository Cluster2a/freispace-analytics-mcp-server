import { z } from "zod";
import { BasePrompt } from "../utils/base-prompt.js";

const reportGenerationSchema = z.object({
  report_type: z
    .enum([
      "executive_summary",
      "detailed_analysis",
      "team_report",
      "individual_report",
    ])
    .describe("The type of report to generate"),
  target_audience: z
    .enum(["management", "hr", "team_leads", "individual"])
    .describe("The intended audience for the report"),
  focus_person: z
    .string()
    .optional()
    .describe("Optional: Focus on a specific person (for individual reports)"),
});

export class ReportGenerationPrompt extends BasePrompt {
  name = "generate_report";
  description =
    "Generate structured prompts for creating professional reports based on staff and collaboration data";
  schema = reportGenerationSchema;

  async execute(args?: z.infer<typeof reportGenerationSchema>) {
    const reportType = args?.report_type || "executive_summary";
    const targetAudience = args?.target_audience || "management";
    const focusPerson = args?.focus_person;

    let promptText = "";
    let description = "";

    // Audience-specific styling
    const audienceContext = {
      management:
        "executive-level language, strategic focus, actionable recommendations",
      hr: "people-focused insights, development opportunities, organizational health",
      team_leads: "operational focus, team dynamics, workflow optimization",
      individual: "personal development focus, career growth, skill building",
    };

    const styleContext = audienceContext[targetAudience];

    switch (reportType) {
      case "executive_summary":
        description = `Executive summary report for ${targetAudience}`;
        promptText = `You are a senior organizational consultant preparing an executive summary for ${targetAudience}. Please create a concise, strategic report with ${styleContext}.

## Executive Summary Report Structure:

### 1. **Key Findings** (2-3 bullet points)
- Most critical insights from the data
- Strategic implications for the organization
- Immediate attention areas

### 2. **Team Overview** 
- Current team composition and structure
- Role distribution and resource allocation
- Overall organizational health indicators

### 3. **Collaboration Effectiveness**
- Cross-functional working relationships
- Project delivery patterns
- Communication and workflow efficiency

### 4. **Strategic Recommendations** (3-5 items)
- High-priority actions for leadership
- Resource allocation suggestions
- Process improvement opportunities

### 5. **Next Steps**
- Immediate actions (30 days)
- Medium-term initiatives (90 days)
- Long-term strategic considerations

**Report Requirements**:
- Maximum 2 pages when printed
- Data-driven insights with specific examples
- Clear ROI implications where applicable
- Professional executive presentation format

**Instructions**: Use /staff and collaboration analysis tools to gather comprehensive data, then synthesize into a strategic executive summary.`;
        break;

      case "detailed_analysis":
        description = `Detailed analysis report for ${targetAudience}`;
        promptText = `You are an organizational analyst creating a comprehensive detailed report for ${targetAudience}. Please prepare an in-depth analysis with ${styleContext}.

## Detailed Analysis Report Structure:

### 1. **Executive Summary**
- Key findings and recommendations overview
- Critical insights and strategic implications

### 2. **Methodology & Data Sources**
- Data collection approach
- Analysis framework used
- Limitations and considerations

### 3. **Team Composition Analysis**
- Detailed role breakdown and distribution
- Skills inventory and expertise mapping
- Organizational structure assessment

### 4. **Collaboration Patterns Deep Dive**
- Individual collaboration profiles
- Cross-functional relationship mapping
- Project-based working patterns
- Communication flow analysis

### 5. **Performance & Effectiveness Metrics**
- Collaboration frequency and quality indicators
- Project success correlation analysis
- Resource utilization patterns

### 6. **Identified Opportunities & Challenges**
- Strengths to leverage
- Gaps and improvement areas
- Risk factors and mitigation strategies

### 7. **Detailed Recommendations**
- Specific action items with timelines
- Resource requirements and budget implications
- Success metrics and measurement approaches

### 8. **Implementation Roadmap**
- Phase-by-phase implementation plan
- Dependencies and critical path items
- Change management considerations

**Instructions**: Conduct thorough analysis using all available tools and data sources to provide comprehensive insights with supporting evidence and detailed recommendations.`;
        break;

      case "team_report":
        description = `Team performance and dynamics report for ${targetAudience}`;
        promptText = `You are a team effectiveness specialist creating a team-focused report for ${targetAudience}. Please analyze team dynamics with ${styleContext}.

## Team Report Structure:

### 1. **Team Overview**
- Current team composition and roles
- Team size and structure analysis
- Key skills and capabilities

### 2. **Team Dynamics Assessment**
- Collaboration patterns within the team
- Communication effectiveness
- Working relationship quality

### 3. **Individual Contributions**
- Role-specific performance indicators
- Unique value contributions by team members
- Skills utilization and development

### 4. **Project Collaboration Analysis**
- How the team works on different project types
- Cross-functional collaboration effectiveness
- Resource sharing and support patterns

### 5. **Team Strengths & Challenges**
- Areas where the team excels
- Collaboration gaps or friction points
- Development opportunities

### 6. **Team Development Recommendations**
- Skills development priorities
- Team building initiatives
- Process improvements for better collaboration

### 7. **Success Metrics & KPIs**
- Measurable indicators of team effectiveness
- Collaboration quality metrics
- Performance tracking suggestions

**Instructions**: Focus on team-level insights using collaboration data and staff information to provide actionable recommendations for team improvement.`;
        break;

      case "individual_report":
        description = focusPerson
          ? `Individual performance report for ${focusPerson} (${targetAudience})`
          : `Individual performance report template for ${targetAudience}`;

        promptText = focusPerson
          ? `You are a professional development consultant creating an individual report for **${focusPerson}** targeted at ${targetAudience}. Please provide analysis with ${styleContext}.

## Individual Report for ${focusPerson}:

### 1. **Professional Profile**
- Current role and responsibilities
- Key skills and expertise areas
- Position within team structure

### 2. **Collaboration Analysis**
- Working relationships and partnerships
- Cross-functional collaboration patterns
- Project involvement and contributions

### 3. **Performance Indicators**
- Collaboration frequency and quality
- Project participation and success rates
- Knowledge sharing and mentoring activities

### 4. **Strengths & Value Contributions**
- Unique skills and capabilities
- Team impact and influence
- Innovation and problem-solving contributions

### 5. **Development Opportunities**
- Skill enhancement areas
- Career growth potential
- Additional collaboration opportunities

### 6. **Recommendations**
- Professional development suggestions
- Career advancement pathways
- Team contribution optimization

### 7. **Action Plan**
- Short-term development goals
- Collaboration expansion opportunities
- Skills training recommendations

**Instructions**: Use staffs_worked_together_query for "${focusPerson}" and cross-reference with team data to provide comprehensive individual insights.`
          : `You are a professional development consultant creating individual report templates for ${targetAudience}. Please provide a framework with ${styleContext}.

## Individual Report Template Structure:

### 1. **Professional Profile Template**
- Role and responsibility assessment framework
- Skills evaluation criteria
- Team position analysis

### 2. **Collaboration Assessment Framework**
- Working relationship evaluation methods
- Cross-functional collaboration metrics
- Project contribution analysis

### 3. **Performance Evaluation Criteria**
- Collaboration effectiveness indicators
- Project success correlation factors
- Knowledge sharing assessment

### 4. **Development Planning Framework**
- Skills gap analysis methodology
- Career progression pathways
- Growth opportunity identification

**Instructions**: Create a comprehensive framework that can be applied to individual team members using the available collaboration and staff data.`;
        break;

      default:
        description = "General report generation";
        promptText =
          "Please generate a professional report based on the available staff and collaboration data.";
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
