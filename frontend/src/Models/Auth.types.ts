export interface AuthState {
    token: string | null;
    userId: string | null;
    role: string | null;
    isAuthenticated: boolean;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    email: string | null;
    phoneNumber: string | null;
  }

  export interface LoginPayload {
    token: string;
    userId: string;
    role: string;
  }
  
  export interface UserProfile {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    email: string | null;
    phoneNumber: string | null;
    userId: string | null;
  }
  