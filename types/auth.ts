import type { User } from "./user"

export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface LoginResponse {
    two_factor: boolean
    user: User
  }
  