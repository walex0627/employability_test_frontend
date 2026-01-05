/**
 * Represents the available roles in the system.
 */
export type UserRole = 'admin' | 'gestor' | 'coder';

/**
 * Represents the user profile data.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Represents a job vacancy entity from the backend.
 */
export interface Vacancy {
  id: string;
  title: string;
  company: string;
  technologies: string;
  softSkills: string;
  description: string;
  location: string;
  salary: string; // Changed to string to match standard form inputs or ranges
  seniority: 'junior' | 'mid' | 'senior';
  modality: 'remote' | 'presential' | 'hybrid';
  maxApplicants: number;
  isActive: boolean;
  applicationsCount: number;
}

/**
 * Expected data structure after a successful login.
 */
export interface LoginResponse {
  accessToken: string;
  user: User;
}

/**
 * Standard API response wrapper used by the NestJS backend.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}