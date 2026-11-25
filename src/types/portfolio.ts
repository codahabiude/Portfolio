export type SectionId = 'home' | 'work' | 'services' | 'about' | 'hire';

export type ProjectCategory = 'All' | 'Full-Stack' | 'Mobile & P2P' | '3D Web';

export interface PortfolioProject {
  id: string;
  repoName: string;
  repoUrl: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  primaryLanguage: string;
  year: string;
  client: string;
  imageUrl: string;
  summary: string;
  architecture: string;
  stack: string[];
  metrics: string;
  deliverables: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  appreciations: number;
  views: number;
  featured?: boolean;
}

export interface ServiceItem {
  index: string;
  title: string;
  discipline: string;
  description: string;
  deliverables: string[];
  typicalTimeline: string;
}

export interface CapabilityMetric {
  label: string;
  proficiency: number;
  detail: string;
}

export interface PortfolioPayload {
  githubProfile: string;
  syncedAt: string | null;
  projects: PortfolioProject[];
  services: ServiceItem[];
  capabilities: CapabilityMetric[];
}

export interface InquiryPayload {
  name: string;
  email: string;
  service: string;
  timeline: string;
  details: string;
}

export interface InquirySubmissionResult {
  referenceId: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  submittedAt: string;
  estimatedResponse: string;
}

export interface InquiryStatusResponse {
  referenceId: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  service: string;
  submittedAt: string;
  estimatedResponse: string;
}

export type SceneSpeedMode = 'paused' | 'cruising' | 'hyper';
export type SceneSpectrumMode = 'section' | 'emerald' | 'cobalt';

export interface SceneControlState {
  explodeFactor: number;
  speedMode: SceneSpeedMode;
  spectrumMode: SceneSpectrumMode;
  wireframeOverlay: boolean;
}
