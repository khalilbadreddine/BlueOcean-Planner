export interface BusinessIdeaState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  content: string | null;
  error: string | null;
}

export interface UserPreferences {
  industry?: string;
  targetAudience?: string;
  skills?: string;
  initialIdea?: string;
}

export const INITIAL_PREFERENCES: UserPreferences = {
  industry: '',
  targetAudience: '',
  skills: '',
  initialIdea: ''
};
