export interface User {
  id: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  token: string;
}