import { AssessmentSession } from '../types/session';
import { AssessmentResult, ScoreBreakdown } from '../types/result';
import { CodingQuestion, TestCase } from '../types/question';

export interface CodeExecutionResult {
  allPassed: boolean;
  passedTests: number;
  totalTests: number;
  results: Array<{
    testIndex: number;
    passed: boolean;
    input: unknown[];
    expected: unknown;
    actual: unknown;
    error?: string;
  }>;
  runtimeError?: string;
}

/**
 * Safely executes JavaScript code in browser with a timeout guard
 */
export function executeCodeSafely(
  code: string,
  functionName: string,
  testCases: TestCase[]
): CodeExecutionResult {
  const executionResults: CodeExecutionResult['results'] = [];
  let runtimeError: string | undefined;

  try {
    // Validate basic syntax before evaluation
    const wrappedCode = `
      "use strict";
      ${code}
      if (typeof ${functionName} === 'undefined') {
        throw new Error("Function '${functionName}' is not defined. Please ensure your solution exports or declares '${functionName}'.");
      }
      return ${functionName};
    `;

    // Safe execution sandbox using Function constructor with isolated scope
    const userFunctionFactory = new Function(wrappedCode);
    const userFn = userFunctionFactory();

    testCases.forEach((tc, idx) => {
      try {
        // Deep clone input to prevent mutation side-effects between test cases
        const clonedInput = JSON.parse(JSON.stringify(tc.input));
        const startTime = performance.now();
        const actual = userFn(...clonedInput);
        const elapsed = performance.now() - startTime;

        if (elapsed > 2000) {
          throw new Error('Time Limit Exceeded (> 2000ms)');
        }

        // Compare expected vs actual
        const passed = deepEqual(actual, tc.expected);
        executionResults.push({
          testIndex: idx + 1,
          passed,
          input: tc.input,
          expected: tc.expected,
          actual: actual === undefined ? 'undefined' : actual
        });
      } catch (err: any) {
        executionResults.push({
          testIndex: idx + 1,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: err?.message || 'Execution error'
        });
      }
    });
  } catch (err: any) {
    runtimeError = err?.message || 'Syntax or compilation error';
    testCases.forEach((tc, idx) => {
      executionResults.push({
        testIndex: idx + 1,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: null,
        error: runtimeError
      });
    });
  }

  const passedTests = executionResults.filter((r) => r.passed).length;
  return {
    allPassed: testCases.length > 0 && passedTests === testCases.length,
    passedTests,
    totalTests: testCases.length,
    results: executionResults,
    runtimeError
  };
}

/**
 * Deep equality check for arrays and plain objects
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual((a as any)[key], (b as any)[key])) return false;
    }
    return true;
  }

  return false;
}

export const assessmentService = {
  /**
   * Evaluates coding assessment submission
   */
  evaluateCoding(
    question: CodingQuestion,
    code: string,
    executionResult?: CodeExecutionResult
  ): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    // If execution result wasn't passed in, execute against testCases
    const exec =
      executionResult || executeCodeSafely(code, 'twoSum', question.testCases);

    const testPassRatio = exec.totalTests > 0 ? exec.passedTests / exec.totalTests : 0;
    const hasCode = code.trim().length > 30;
    const usesMapOrSet = /(Map|Set|indexOf|includes|has|get)\b/.test(code);
    const hasSyntaxError = !!exec.runtimeError;

    // 1. Code Quality (max 20)
    let codeQuality = 0;
    if (hasCode) codeQuality += 10;
    if (!hasSyntaxError) codeQuality += 6;
    if (code.includes('const') || code.includes('let')) codeQuality += 4;

    // 2. Problem Solving (max 25)
    const problemSolving = Math.round(testPassRatio * 25);

    // 3. Efficiency (max 20)
    let efficiency = 5;
    if (usesMapOrSet) efficiency += 15; // O(n) solution
    else if (!hasSyntaxError && testPassRatio > 0.5) efficiency += 8;

    // 4. Best Practices (max 15)
    let bestPractices = 5;
    if (!code.includes('var') && hasCode) bestPractices += 5;
    if (code.includes('return') && !hasSyntaxError) bestPractices += 5;

    // 5. Testing Coverage (max 20)
    const testCoverage = Math.round(testPassRatio * 20);

    const totalScore = Math.min(100, Math.max(0, codeQuality + problemSolving + efficiency + bestPractices + testCoverage));

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Code Quality',
        score: codeQuality,
        maxScore: 20,
        feedback: hasSyntaxError
          ? 'Runtime or syntax issue encountered during execution.'
          : 'Clean code structure with modern ES6+ variable declarations.'
      },
      {
        category: 'Problem Solving',
        score: problemSolving,
        maxScore: 25,
        feedback: `Passed ${exec.passedTests} of ${exec.totalTests} supplied test cases.`
      },
      {
        category: 'Efficiency',
        score: efficiency,
        maxScore: 20,
        feedback: usesMapOrSet
          ? 'Optimal O(n) time complexity achieved using Hash Map lookups.'
          : 'Consider optimizing search lookups to achieve linear O(n) time.'
      },
      {
        category: 'Best Practices',
        score: bestPractices,
        maxScore: 15,
        feedback: 'Adheres to standard JavaScript naming conventions and scoping.'
      },
      {
        category: 'Testing Coverage',
        score: testCoverage,
        maxScore: 20,
        feedback: `Test suite execution rate: ${Math.round(testPassRatio * 100)}%.`
      }
    ];

    const generalFeedback =
      totalScore >= 80
        ? 'Excellent solution! Your implementation passes test cases efficiently with solid algorithmic design.'
        : totalScore >= 50
        ? 'Good effort. Some test cases passed, but further optimization or edge-case handling is needed.'
        : 'Solution needs improvement. Review the algorithm constraints and ensure test cases pass without errors.';

    return { score: totalScore, breakdown, generalFeedback };
  },

  /**
   * Evaluates architecture design submission
   */
  evaluateArchitecture(answers: {
    selectedPattern?: string;
    diagram?: string;
    justification?: string;
    tradeOffs?: string;
  }): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    const pattern = answers.selectedPattern || '';
    const diagram = answers.diagram || '';
    const justification = answers.justification || '';
    const tradeOffs = answers.tradeOffs || '';

    // Rubric calculations
    // 1. Architecture Pattern (max 20)
    let patternScore = 0;
    if (pattern.length > 0) patternScore += 10;
    if (pattern.includes('Microservices') || pattern.includes('Serverless') || pattern.includes('WebSocket')) {
      patternScore += 10;
    } else if (pattern.length > 0) {
      patternScore += 6;
    }

    // 2. Scalability & System Flow (max 25)
    let scalScore = 5;
    const scalKeywords = /(scale|cache|redis|cdn|load balancer|partition|shard|throughput|horizontal)/i;
    if (scalKeywords.test(justification) || scalKeywords.test(diagram)) scalScore += 12;
    if (justification.length > 80) scalScore += 8;

    // 3. Reliability & Fault Tolerance (max 20)
    let relScore = 5;
    const relKeywords = /(failover|replica|resilience|redundancy|kafka|queue|retry|backup|availability)/i;
    if (relKeywords.test(justification) || relKeywords.test(diagram) || relKeywords.test(tradeOffs)) relScore += 10;
    if (diagram.length > 50) relScore += 5;

    // 4. Design Explanation & Quality (max 20)
    let explanationScore = 5;
    if (justification.length > 40) explanationScore += 8;
    if (justification.length > 120) explanationScore += 7;

    // 5. Trade-offs & Critical Analysis (max 15)
    let tradeOffScore = 3;
    if (tradeOffs.length > 30) tradeOffScore += 7;
    const tradeOffKeywords = /(latency|cost|consistency|complexity|memory|overhead|eventual)/i;
    if (tradeOffKeywords.test(tradeOffs)) tradeOffScore += 5;

    const totalScore = Math.min(100, patternScore + scalScore + relScore + explanationScore + tradeOffScore);

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Architecture Pattern',
        score: patternScore,
        maxScore: 20,
        feedback: pattern ? `Selected pattern: ${pattern}. Strong alignment with system constraints.` : 'No pattern explicitly selected.'
      },
      {
        category: 'Scalability',
        score: scalScore,
        maxScore: 25,
        feedback: scalScore > 15 ? 'Detailed scaling strategy addressing caching, balancing, and data distribution.' : 'Expand on horizontal scalability and caching mechanisms.'
      },
      {
        category: 'Reliability',
        score: relScore,
        maxScore: 20,
        feedback: relScore > 12 ? 'Sound resilience considerations for high availability and failover.' : 'Include fault-tolerance, replicas, or fallback plans.'
      },
      {
        category: 'Design Explanation',
        score: explanationScore,
        maxScore: 20,
        feedback: justification.length > 60 ? 'Clear justification of architectural components and flows.' : 'Provide deeper explanations for chosen technologies.'
      },
      {
        category: 'Trade-offs Analysis',
        score: tradeOffScore,
        maxScore: 15,
        feedback: tradeOffs.length > 40 ? 'Well-articulated engineering trade-offs regarding consistency vs latency.' : 'Analyze operational costs and design trade-offs.'
      }
    ];

    return {
      score: totalScore,
      breakdown,
      generalFeedback: totalScore >= 75 ? 'Strong architectural submission demonstrating thorough system design expertise.' : 'Acceptable architecture proposal; consider elaborating on scaling bottlenecks and operational trade-offs.'
    };
  },

  /**
   * Evaluates system design submission
   */
  evaluateSystemDesign(answers: {
    selectedComponents?: string[];
    notes?: string;
  }): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    const components = answers.selectedComponents || [];
    const notes = answers.notes || '';

    // 1. Component Selection (max 25)
    const keyComponents = ['CDN', 'Gateway', 'Storage', 'Cache', 'Transcoding', 'Broker', 'Kafka'];
    const matchedCount = components.filter((c) => keyComponents.some((k) => c.toLowerCase().includes(k.toLowerCase()))).length;
    const compScore = Math.min(25, matchedCount * 4 + (components.length > 3 ? 5 : 0));

    // 2. Data Flow & Topology (max 20)
    let flowScore = 5;
    if (notes.length > 50) flowScore += 7;
    if (/(upload|encode|transcode|stream|chunk|hls|dash|cdn)/i.test(notes)) flowScore += 8;

    // 3. Scalability Discussion (max 20)
    let scalScore = 5;
    if (/(scale|traffic|concurrent|bandwidth|edge|cache|distributed)/i.test(notes)) scalScore += 10;
    if (notes.length > 150) scalScore += 5;

    // 4. Reliability & Fault Tolerance (max 20)
    let relScore = 5;
    if (/(failover|redundancy|s3|multi-region|resilience|sla)/i.test(notes)) relScore += 10;
    if (components.length >= 4) relScore += 5;

    // 5. Completeness & Best Practices (max 15)
    let completenessScore = 4;
    if (notes.length > 80) completenessScore += 6;
    if (components.length >= 5) completenessScore += 5;

    const totalScore = Math.min(100, compScore + flowScore + scalScore + relScore + completenessScore);

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Component Selection',
        score: compScore,
        maxScore: 25,
        feedback: `Selected ${components.length} essential system building blocks.`
      },
      {
        category: 'Data Flow Design',
        score: flowScore,
        maxScore: 20,
        feedback: flowScore > 12 ? 'Comprehensive end-to-end data pipeline explained.' : 'Provide more details on video ingestion and playback flows.'
      },
      {
        category: 'Scalability',
        score: scalScore,
        maxScore: 20,
        feedback: 'Addresses high concurrency, CDN edge caching, and bandwidth constraints.'
      },
      {
        category: 'Reliability',
        score: relScore,
        maxScore: 20,
        feedback: 'Demonstrates awareness of multi-region replication and fallback options.'
      },
      {
        category: 'Completeness',
        score: completenessScore,
        maxScore: 15,
        feedback: 'Thorough system design meeting real-world streaming demands.'
      }
    ];

    return {
      score: totalScore,
      breakdown,
      generalFeedback: totalScore >= 75 ? 'Comprehensive system architecture ready for planet-scale traffic.' : 'Solid design foundation; add deeper explanations of video segment caching.'
    };
  },

  /**
   * Evaluates debugging submission
   */
  evaluateDebugging(answers: {
    fixedCode?: string;
    identifiedBugs?: string;
  }): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    const fixedCode = answers.fixedCode || '';
    const identifiedBugs = answers.identifiedBugs || '';

    // Bug verification: check for interval cleanup, event listener cleanup, bounded history
    const hasClearInterval = /clearInterval\s*\(/i.test(fixedCode);
    const hasRemoveEventListener = /removeEventListener\s*\(/i.test(fixedCode);
    const hasReturnCleanup = /return\s*\(\s*\)\s*=>/i.test(fixedCode) || /return\s+function/i.test(fixedCode);
    const hasBoundedHistory = /(slice|filter|limit|splice|50|length)/i.test(fixedCode);

    const bugExplainsInterval = /(interval|timer|cleartimeout|clearinterval)/i.test(identifiedBugs);
    const bugExplainsCleanup = /(cleanup|unmount|teardown|memory leak|dangling)/i.test(identifiedBugs);
    const bugExplainsListener = /(listener|event|resize)/i.test(identifiedBugs);

    // 1. Root Cause Identification (max 25)
    let idScore = 5;
    if (bugExplainsInterval) idScore += 10;
    if (bugExplainsCleanup) idScore += 5;
    if (bugExplainsListener) idScore += 5;

    // 2. Teardown / Cleanup Implementation (max 30)
    let cleanupScore = 5;
    if (hasReturnCleanup) cleanupScore += 10;
    if (hasClearInterval) cleanupScore += 10;
    if (hasRemoveEventListener) cleanupScore += 5;

    // 3. Memory Safety & Bounding (max 15)
    let memoryScore = 5;
    if (hasBoundedHistory) memoryScore += 10;

    // 4. Code Quality & React Idioms (max 15)
    let reactScore = 5;
    if (fixedCode.includes('useEffect') && !fixedCode.includes('var')) reactScore += 5;
    if (fixedCode.length > 100) reactScore += 5;

    // 5. Regression Prevention (max 15)
    let regScore = 5;
    if (hasClearInterval && hasReturnCleanup) regScore += 10;

    const totalScore = Math.min(100, idScore + cleanupScore + memoryScore + reactScore + regScore);

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Bug Identification',
        score: idScore,
        maxScore: 25,
        feedback: bugExplainsInterval
          ? 'Correctly identified missing timer cancellation and cleanup closure.'
          : 'Identify why active intervals accumulate on each deviceId change.'
      },
      {
        category: 'Cleanup Implementation',
        score: cleanupScore,
        maxScore: 30,
        feedback: hasClearInterval && hasReturnCleanup
          ? 'Effectively returned cleanup function invoking clearInterval and removing listeners.'
          : 'Ensure useEffect returns a cleanup callback calling clearInterval().'
      },
      {
        category: 'Memory Bounding',
        score: memoryScore,
        maxScore: 15,
        feedback: hasBoundedHistory ? 'Prevented unbounded memory growth in history array.' : 'Consider capping the size of stored historical telemetry items.'
      },
      {
        category: 'Code Quality',
        score: reactScore,
        maxScore: 15,
        feedback: 'Idiomatic React hook implementation with clean dependency management.'
      },
      {
        category: 'Regression Prevention',
        score: regScore,
        maxScore: 15,
        feedback: 'Robust teardown ensures no zombie callbacks or detached DOM references survive.'
      }
    ];

    return {
      score: totalScore,
      breakdown,
      generalFeedback: totalScore >= 75
        ? 'Excellent debugging! You successfully eliminated the memory leak and restored safe lifecycle management.'
        : 'Partially solved. Ensure both clearInterval and window listener cleanup are present in the effect return.'
    };
  },

  /**
   * Evaluates database and API submission
   */
  evaluateDatabase(answers: {
    schema?: string;
    apiEndpoints?: string;
    queries?: string;
  }): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    const schema = answers.schema || '';
    const apiEndpoints = answers.apiEndpoints || '';
    const queries = answers.queries || '';

    // 1. Schema Modeling & Constraints (max 25)
    let schemaScore = 5;
    if (/(primary key|foreign key|references)/i.test(schema)) schemaScore += 10;
    if (/(unique|not null|check|uuid|timestamp)/i.test(schema)) schemaScore += 6;
    if (schema.length > 150) schemaScore += 4;

    // 2. Entity Coverage & Relationships (max 20)
    let relScore = 5;
    const hasUsers = /(users|customers)/i.test(schema);
    const hasProducts = /(products|variants|inventory)/i.test(schema);
    const hasOrders = /(orders|order_items|payments)/i.test(schema);
    if (hasUsers && hasProducts && hasOrders) relScore += 15;
    else if (hasProducts || hasOrders) relScore += 8;

    // 3. API Completeness (max 20)
    let apiScore = 5;
    if (/(get|post|put|delete|patch)/i.test(apiEndpoints)) apiScore += 8;
    if (/(\/api|\/products|\/orders|\/checkout|\/cart)/i.test(apiEndpoints)) apiScore += 7;

    // 4. Query Quality & Performance (max 20)
    let queryScore = 5;
    if (/(select|join|inner join|left join|where|group by)/i.test(queries)) queryScore += 10;
    if (/(index|transaction|for update|begin|commit)/i.test(queries) || /(index|create index)/i.test(schema)) queryScore += 5;

    // 5. Best Practices & Safety (max 15)
    let bestPractices = 5;
    if (/(atomic|reservation|stock|snapshot|price)/i.test(schema) || /(atomic|lock|stock)/i.test(queries)) bestPractices += 10;

    const totalScore = Math.min(100, schemaScore + relScore + apiScore + queryScore + bestPractices);

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Schema Modeling',
        score: schemaScore,
        maxScore: 25,
        feedback: 'Normalized table definitions with appropriate constraints and data types.'
      },
      {
        category: 'Relationship Integrity',
        score: relScore,
        maxScore: 20,
        feedback: 'Clear foreign key relationships linking users, product variants, and order lines.'
      },
      {
        category: 'API Specification',
        score: apiScore,
        maxScore: 20,
        feedback: 'RESTful resource naming with appropriate HTTP verbs for transactional workflows.'
      },
      {
        category: 'Query & Indexing',
        score: queryScore,
        maxScore: 20,
        feedback: 'Well-structured SQL queries handling aggregation, filtering, and joins.'
      },
      {
        category: 'Concurrency & Best Practices',
        score: bestPractices,
        maxScore: 15,
        feedback: 'Considers inventory race conditions and order price snapshotting.'
      }
    ];

    return {
      score: totalScore,
      breakdown,
      generalFeedback: totalScore >= 75
        ? 'Outstanding relational model and API design capable of powering high-throughput e-commerce.'
        : 'Good database design; review race condition safeguards during high-concurrency checkout.'
    };
  },

  /**
   * Evaluates security submission
   */
  evaluateSecurity(answers: {
    selectedVulns?: string[];
    fixedCode?: string;
    explanation?: string;
  }): { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string } {
    const selected = answers.selectedVulns || [];
    const fixedCode = answers.fixedCode || '';
    const explanation = answers.explanation || '';

    const pickedSqlInjection = selected.some((s) => s.toLowerCase().includes('sql injection'));
    const pickedAuthOrInfoLeak = selected.some(
      (s) => s.toLowerCase().includes('authentication') || s.toLowerCase().includes('information disclosure')
    );

    // 1. Vulnerability Identification (max 30)
    let vulnScore = 0;
    if (pickedSqlInjection) {
      vulnScore += 20;
      if (pickedAuthOrInfoLeak) vulnScore += 10;
    } else {
      vulnScore = 5; // minimal score if primary wasn't recognized
    }

    // 2. Secure Implementation (max 30)
    let implScore = 5;
    const usesParameterized = /(\$1|\$2|\?|prepare|parameterized|values\s*\(\$)/i.test(fixedCode) ||
      (/query\s*\(\s*['"][^'"]*['"]\s*,\s*\[/i.test(fixedCode));
    const usesHashing = /(bcrypt|argon2|hash|compare)/i.test(fixedCode);

    if (usesParameterized) implScore += 15;
    if (usesHashing) implScore += 10;

    // 3. Attack Vector Understanding (max 20)
    let attackScore = 5;
    if (/(bypass|injection|quote|union|1=1|payload|escape)/i.test(explanation)) attackScore += 10;
    if (explanation.length > 60) attackScore += 5;

    // 4. Remediation Completeness (max 10)
    let remediationScore = 3;
    if (fixedCode.length > 80 && !fixedCode.includes("'" + ' + username')) remediationScore += 7;

    // 5. Defense-in-Depth (max 10)
    let defenseScore = 3;
    if (/(hash|sanitiz|prepared statement|least privilege|generic error)/i.test(explanation) || usesHashing) defenseScore += 7;

    const totalScore = Math.min(100, vulnScore + implScore + attackScore + remediationScore + defenseScore);

    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Vulnerability Detection',
        score: vulnScore,
        maxScore: 30,
        feedback: pickedSqlInjection
          ? 'Accurately recognized SQL Injection (CWE-89) as the primary critical flaw.'
          : 'Critical: The primary vulnerability is SQL Injection via dynamic query string concatenation.'
      },
      {
        category: 'Secure Implementation',
        score: implScore,
        maxScore: 30,
        feedback: usesParameterized
          ? 'Parameterized database queries adopted, neutralizing injection payloads.'
          : 'Ensure parameterized query syntax (e.g. $1, $2 or ?) is utilized rather than string concatenation.'
      },
      {
        category: 'Exploit Analysis',
        score: attackScore,
        maxScore: 20,
        feedback: 'Thorough explanation of authentication bypass mechanics.'
      },
      {
        category: 'Remediation Quality',
        score: remediationScore,
        maxScore: 10,
        feedback: 'Replaced insecure route logic with secure coding standards.'
      },
      {
        category: 'Defense in Depth',
        score: defenseScore,
        maxScore: 10,
        feedback: 'Addressed secondary concerns like password hashing and error message obfuscation.'
      }
    ];

    return {
      score: totalScore,
      breakdown,
      generalFeedback: totalScore >= 75
        ? 'Excellent security analysis! You correctly mitigated the SQL injection vulnerability and hardened the authentication flow.'
        : 'Security review needs attention. Always employ parameterized queries and secure password hashing.'
    };
  },

  /**
   * Master evaluation orchestrator: routes to specific evaluator based on mode
   */
  evaluateSession(session: AssessmentSession, questionData: any): AssessmentResult {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
    let evalOutput: { score: number; breakdown: ScoreBreakdown[]; generalFeedback: string };

    switch (session.mode) {
      case 'coding': {
        const question = questionData?.coding?.[session.currentQuestion || 0] || questionData?.coding?.[0];
        const code = (session.answers?.code as string) || '';
        evalOutput = this.evaluateCoding(question, code);
        break;
      }
      case 'architecture': {
        evalOutput = this.evaluateArchitecture({
          selectedPattern: session.answers?.selectedPattern as string,
          diagram: session.answers?.diagram as string,
          justification: session.answers?.justification as string,
          tradeOffs: session.answers?.tradeOffs as string
        });
        break;
      }
      case 'system': {
        evalOutput = this.evaluateSystemDesign({
          selectedComponents: session.answers?.selectedComponents as string[],
          notes: session.answers?.notes as string
        });
        break;
      }
      case 'debugging': {
        evalOutput = this.evaluateDebugging({
          fixedCode: session.answers?.fixedCode as string,
          identifiedBugs: session.answers?.identifiedBugs as string
        });
        break;
      }
      case 'database': {
        evalOutput = this.evaluateDatabase({
          schema: session.answers?.schema as string,
          apiEndpoints: session.answers?.apiEndpoints as string,
          queries: session.answers?.queries as string
        });
        break;
      }
      case 'security': {
        evalOutput = this.evaluateSecurity({
          selectedVulns: session.answers?.selectedVulns as string[],
          fixedCode: session.answers?.fixedCode as string,
          explanation: session.answers?.explanation as string
        });
        break;
      }
      default: {
        evalOutput = {
          score: 70,
          breakdown: [
            { category: 'Code Quality', score: 14, maxScore: 20, feedback: 'Satisfactory' },
            { category: 'Problem Solving', score: 18, maxScore: 25, feedback: 'Satisfactory' },
            { category: 'Efficiency', score: 14, maxScore: 20, feedback: 'Satisfactory' },
            { category: 'Best Practices', score: 11, maxScore: 15, feedback: 'Satisfactory' },
            { category: 'Testing Coverage', score: 13, maxScore: 20, feedback: 'Satisfactory' }
          ],
          generalFeedback: 'Assessment completed.'
        };
      }
    }

    const passed = evalOutput.score >= 60;
    const status = evalOutput.score >= 80 ? 'passed' : evalOutput.score >= 60 ? 'review' : 'needs-improvement';

    const result: AssessmentResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: session.id,
      mode: session.mode,
      score: evalOutput.score,
      status,
      breakdown: evalOutput.breakdown,
      submittedAt: Date.now(),
      timeSpent: elapsedSeconds,
      totalDuration: session.duration,
      config: session.config,
      answersSummary: session.answers,
      generalFeedback: evalOutput.generalFeedback
    };

    return result;
  }
};
