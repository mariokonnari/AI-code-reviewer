import { ReviewType } from '@/types';

export const getReviewPrompt = (code: string, language: string, reviewType: ReviewType): string => {
  const basePrompt = `You are an expert code reviewer. Analyze the following ${language} code.`;
  
  const prompts: Record<ReviewType, string> = {
    security: `${basePrompt}

Focus on SECURITY issues:
- Injection vulnerabilities (SQL, XSS, etc.)
- Authentication/authorization flaws
- Data exposure risks
- Insecure dependencies
- Hardcoded secrets

Provide specific line-by-line feedback with severity levels (Critical/High/Medium/Low).`,

    performance: `${basePrompt}

Focus on PERFORMANCE optimization:
- Time complexity issues
- Memory leaks
- Unnecessary re-renders (React)
- Database query optimization
- Caching opportunities

Suggest concrete improvements with expected impact.`,

    readability: `${basePrompt}

Focus on CODE READABILITY:
- Naming conventions
- Code organization
- Comments and documentation
- Complexity reduction
- Best practices for ${language}

Suggest refactoring with before/after examples.`,

    testing: `${basePrompt}

Focus on TESTABILITY:
- Identify untestable code
- Suggest test cases (unit, integration)
- Point out edge cases
- Recommend testing strategies
- Highlight mock/stub opportunities

Provide example test code.`,

    general: `${basePrompt}

Provide a COMPREHENSIVE review covering:
1. Code quality and best practices
2. Potential bugs or edge cases
3. Performance considerations
4. Security concerns
5. Suggestions for improvement

Be constructive and specific.`,
  };

  return `${prompts[reviewType]}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Format your response with clear sections and actionable feedback.`;
};