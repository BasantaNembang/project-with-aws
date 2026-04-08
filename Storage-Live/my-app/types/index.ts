export interface User {
  firstName: string;
  lastName: string;
}

export interface ImageItem {
  id: string;
  url: string;
  caption?: string;
  timestamp: string;
}

export interface VideoItem {
  id: string;
  thumbnail: string;
  title: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (firstName: string, lastName: string) => void;
  logout: () => void;
}


export interface AuthDTO {
  email: string;
  userName: string;
  password: string;
}

