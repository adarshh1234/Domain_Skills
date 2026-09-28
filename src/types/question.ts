export interface TestCase {
  input: unknown[];
  expected: unknown;
  description?: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  testCases: TestCase[];
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
}

export interface ArchitectureQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  patterns: string[];
  requirements: string[];
  starterDiagram?: string;
}

export interface SystemDesignQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  availableComponents: string[];
}

export interface DebuggingQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  buggyCode: string;
  starterCode: string;
  expectedBehavior: string;
  hints: string[];
  knownBugDescription: string;
}

export interface DatabaseQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  starterSchema: string;
  sampleQueriesPrompt: string;
}

export interface SecurityQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  vulnerableSnippet: string;
  vulnerabilityOptions: string[];
  primaryVulnerability: string;
  hints: string[];
}

export interface QuestionsCatalog {
  coding: CodingQuestion[];
  architecture: ArchitectureQuestion[];
  system: SystemDesignQuestion[];
  debugging: DebuggingQuestion[];
  database: DatabaseQuestion[];
  security: SecurityQuestion[];
}
