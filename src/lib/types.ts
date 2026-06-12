// src/lib/types.ts
// Mirror the Soroban contract structs so TypeScript knows exactly
// what shape each contract call returns.

export interface CircleStatus {
  name: string;
  admin: string;
  isActive: boolean;
  currentCycle: number;
  payoutIndex: number;
  cycleDeadline: string;     // ISO 8601 for display
  contributionUsdc: number;  // human-readable USDC (e.g. 10.00)
  members: string[];
}

export interface Contribution {
  member: string;
  cycle: number;
  amount: bigint;
  timestamp: bigint;
}

export type ProposalType =
  | { tag: "ChangeAmount"; value: bigint }
  | { tag: "ChangeCycleLength"; value: bigint }
  | { tag: "AddMember"; value: string }
  | { tag: "RemoveMember"; value: string };

export interface Proposal {
  id: number;
  proposer: string;
  proposal_type: ProposalType;
  votes_yes: number;
  votes_no: number;
  voters: string[];
  executed: boolean;
}

export interface CreateCircleParams {
  name: string;
  memberAddresses: string[];
  contributionUsdc: number;
  cycleLengthSecs: number;
}

export interface CircleConfig {
  name: string;
  amount: number | bigint;
  limit: number;
}

export type ReputationTier = "New member" | "Building trust" | "Trusted";

export function getReputationTier(score: number): ReputationTier {
  if (score >= 100) return "Trusted";
  if (score >= 50) return "Building trust";
  return "New member";
}
