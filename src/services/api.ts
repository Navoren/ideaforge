import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Define API types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
  email?: string;
}

export interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  category: string;
  github_link?: string;
  skills_needed?: string;
  tags: string[];
  progress: number;
  is_completed: boolean;
  is_active: boolean;
  creator_id: number;
  creator: User;
  collaborators: User[];
  created_at: string;
  updated_at?: string;
}

export interface CreateProjectRequest {
  title: string;
  summary: string;
  description: string;
  category: string;
  github_link?: string;
  skills_needed?: string;
  tags?: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  summary?: string;
  description?: string;
  category?: string;
  github_link?: string;
  skills_needed?: string;
  tags?: string[];
  progress?: number;
  is_completed?: boolean;
  is_active?: boolean;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CollaborationRequest {
  id: number;
  user_id: number;
  project_id: number;
  message?: string;
  role?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
  responded_at?: string;
  user?: User;
  project?: {
    id: number;
    title: string;
    category: string;
  };
}

export interface CreateCollaborationRequest {
  project_id: number;
  message?: string;
  role?: string;
}

export interface UpdateCollaborationRequest {
  status: 'accepted' | 'rejected';
  response_message?: string;
}

export interface CollaborationRequestListResponse {
  requests: CollaborationRequest[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaperRecommendation {
  title: string;
  score: number;
  arxiv_id?: string;
  url?: string;
}

export interface RecommendationRequest {
  text: string;
  max_results?: number;
}

export interface RecommendationResponse {
  query: string;
  recommendations: PaperRecommendation[];
  count: number;
}

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create the API class
class API {
  private api: AxiosInstance;
  private authTokens: AuthTokens | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token to requests
    this.api.interceptors.request.use(
      (config) => {
        const tokens = this.getTokensFromStorage();
        if (tokens && config.headers) {
          config.headers['Authorization'] = `${tokens.token_type} ${tokens.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, log out the user
            this.logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Load tokens from storage on initialization
    this.loadTokensFromStorage();
  }

  // Helper method to determine if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.authTokens;
  }

  // Token management methods
  private getTokensFromStorage(): AuthTokens | null {
    const tokensJson = localStorage.getItem('auth_tokens');
    return tokensJson ? JSON.parse(tokensJson) : null;
  }

  private saveTokensToStorage(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    this.authTokens = tokens;
  }

  private loadTokensFromStorage(): void {
    this.authTokens = this.getTokensFromStorage();
  }

  private clearTokensFromStorage(): void {
    localStorage.removeItem('auth_tokens');
    this.authTokens = null;
  }

  private async refreshToken(): Promise<boolean> {
    if (!this.authTokens?.refresh_token) {
      return false;
    }

    try {
      const response = await axios.post<AuthTokens>(
        `${API_URL}/auth/refresh`,
        { token: this.authTokens.refresh_token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      this.saveTokensToStorage(response.data);
      return true;
    } catch (error) {
      this.clearTokensFromStorage();
      return false;
    }
  }

  // Auth methods
  public async login(credentials: LoginRequest): Promise<User> {
    const response = await this.api.post<AuthTokens>('/auth/login', credentials);
    this.saveTokensToStorage(response.data);
    return this.getCurrentUser();
  }

  public async register(userData: RegisterRequest): Promise<User> {
    const response = await this.api.post<User>('/auth/register', userData);
    return response.data;
  }

  public logout(): void {
    this.clearTokensFromStorage();
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me');
    return response.data;
  }

  // User methods
  public async updateUser(userData: UpdateUserRequest): Promise<User> {
    const response = await this.api.put<User>('/users/me', userData);
    return response.data;
  }

  public async getUser(userId: number): Promise<User> {
    const response = await this.api.get<User>(`/users/${userId}`);
    return response.data;
  }

  public async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const response = await this.api.get<User[]>('/users/search', {
      params: { query, limit },
    });
    return response.data;
  }

  // Project methods
  public async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const response = await this.api.post<Project>('/projects', projectData);
    return response.data;
  }

  public async getProjects(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    tags?: string
  ): Promise<ProjectListResponse> {
    const response = await this.api.get<ProjectListResponse>('/projects', {
      params: {
        skip: (page - 1) * limit,
        limit,
        search,
        category,
        tags,
      },
    });
    return response.data;
  }

  public async getMyProjects(
    page: number = 1,
    limit: number = 10,
    includeCollaborations: boolean = false
  ): Promise<ProjectListResponse> {
    const response = await this.api.get<ProjectListResponse>('/projects/my-projects', {
      params: {
        skip: (page - 1) * limit,
        limit,
        include_collaborations: includeCollaborations,
      },
    });
    return response.data;
  }

  public async getProject(projectId: number): Promise<Project> {
    const response = await this.api.get<Project>(`/projects/${projectId}`);
    return response.data;
  }

  public async updateProject(
    projectId: number,
    projectData: UpdateProjectRequest
  ): Promise<Project> {
    const response = await this.api.put<Project>(`/projects/${projectId}`, projectData);
    return response.data;
  }

  public async deleteProject(projectId: number): Promise<void> {
    await this.api.delete(`/projects/${projectId}`);
  }

  public async addCollaborator(projectId: number, userId: number): Promise<Project> {
    const response = await this.api.post<Project>(
      `/projects/${projectId}/collaborators/${userId}`
    );
    return response.data;
  }

  public async removeCollaborator(projectId: number, userId: number): Promise<Project> {
    const response = await this.api.delete<Project>(
      `/projects/${projectId}/collaborators/${userId}`
    );
    return response.data;
  }

  // Collaboration request methods
  public async createCollaborationRequest(
    requestData: CreateCollaborationRequest
  ): Promise<CollaborationRequest> {
    const response = await this.api.post<CollaborationRequest>(
      '/collaborations',
      requestData
    );
    return response.data;
  }

  public async getSentRequests(
    page: number = 1,
    limit: number = 10,
    status?: 'pending' | 'accepted' | 'rejected'
  ): Promise<CollaborationRequestListResponse> {
    const response = await this.api.get<CollaborationRequestListResponse>('/collaborations/sent', {
      params: {
        skip: (page - 1) * limit,
        limit,
        status,
      },
    });
    return response.data;
  }

  public async getReceivedRequests(
    page: number = 1,
    limit: number = 10,
    status?: 'pending' | 'accepted' | 'rejected'
  ): Promise<CollaborationRequestListResponse> {
    const response = await this.api.get<CollaborationRequestListResponse>(
      '/collaborations/received',
      {
        params: {
          skip: (page - 1) * limit,
          limit,
          status,
        },
      }
    );
    return response.data;
  }

  public async getCollaborationRequest(requestId: number): Promise<CollaborationRequest> {
    const response = await this.api.get<CollaborationRequest>(`/collaborations/${requestId}`);
    return response.data;
  }

  public async updateCollaborationRequest(
    requestId: number,
    requestData: UpdateCollaborationRequest
  ): Promise<CollaborationRequest> {
    const response = await this.api.put<CollaborationRequest>(
      `/collaborations/${requestId}`,
      requestData
    );
    return response.data;
  }

  public async deleteCollaborationRequest(requestId: number): Promise<void> {
    await this.api.delete(`/collaborations/${requestId}`);
  }

  // Recommendation methods
  public async getRecommendations(
    requestData: RecommendationRequest
  ): Promise<RecommendationResponse> {
    const response = await this.api.post<RecommendationResponse>(
      '/recommendations',
      requestData
    );
    return response.data;
  }

  public async getProjectRecommendations(
    projectId: number,
    maxResults: number = 5
  ): Promise<RecommendationResponse> {
    const response = await this.api.get<RecommendationResponse>(
      `/recommendations/project/${projectId}`,
      {
        params: { max_results: maxResults },
      }
    );
    return response.data;
  }
}

// Export a singleton instance
export const api = new API();

