
export enum IssueStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  SOLVED = 'Solved'
}

export enum IssueCategory {
  LIGHTING = 'Broken Lights',
  PLUMBING = 'Water Leakage',
  CLEANLINESS = 'Cleanliness',
  INTERNET = 'Internet Problems',
  MAINTENANCE = 'General Maintenance',
  OTHER = 'Other'
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IssueReport {
  id: string;
  category: IssueCategory;
  description: string;
  photo?: string; // base64
  location: Location;
  status: IssueStatus;
  createdAt: number;
  updatedAt: number;
  aiAssessment?: string;
}

export type AppView = 'reporter' | 'admin';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
