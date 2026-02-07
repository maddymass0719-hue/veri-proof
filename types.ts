
export interface ProofEntry {
  id: string;
  fileName: string;
  fileSize: number;
  hash: string;
  timestamp: number;
  description?: string;
  status: 'verified' | 'tampered' | 'original';
}

export type VerificationResult = 'idle' | 'matching' | 'not-matching' | 'error';
