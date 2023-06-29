export interface SecurityConfig {
  accessControl?: AccessControlConfig;
}

export interface AccessControlConfig {
  enable?: boolean;
  pattern?: string;
  // details?: AccessControlDetail[];
}

export interface AccessControlDetail {
  enable?: boolean;
  pattern?: string;
  weight?: number;
}
