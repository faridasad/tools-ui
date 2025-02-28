export interface IUserRegistrationRequest {
  email: string; // Valid email format
  password: string; // Minimum 8 characters
  fullName: string; // User's full name
}

// Response (201 Created)
export interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}

// Response (200 OK)
export interface ITokenResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    modifiedAt: string;
  };
}

// Response (200 OK)
export interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  modifiedAt: string;
}
