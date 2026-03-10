export interface LoginRequest {
    initData: string;
}
export interface LoginResponse {
    sessionToken: string;
    refreshToken?: string;
    expiresAt?: string;
}
export interface RefreshRequest {
    refreshToken: string;
}
