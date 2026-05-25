export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  userName: string;
  role?: string;
}

export interface JWTPayload {
  sub: number;
  username: string;
  email: string;
}
