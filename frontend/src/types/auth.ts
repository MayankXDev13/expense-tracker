export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface ISignUpData {
  username: string;
  email: string;
  password: string;
  loginType: string;
}

export interface ISignInData {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token?: string; 
}
