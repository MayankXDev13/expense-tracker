export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  loginType: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string; 
}
