export interface CognitiveAnalysis {
  dominantEmotion: string;
  biasesDetected: string[];
  reframingTip: string;
}

export interface JournalMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
  summary?: string;
  cognitiveAnalysis?: CognitiveAnalysis;
}

export interface JournalEntry {
  id: string;
  uid: string;
  userEmail?: string;
  message: string;
  reply: string;
  summary: string;
  cognitiveAnalysis: CognitiveAnalysis;
  createdAt: string;
  turnCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  token: string;
}

export interface SecurityStatus {
  framework: string;
  modelSelected: string;
  tenantPath: string;
  authScheme: string;
  leastPrivilegeExecution: string;
  keyManagement: string;
  structuredOutputSchema: string;
  isGeminiKeyConfigured: boolean;
}
