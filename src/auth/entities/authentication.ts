import { JwtPayload } from 'jsonwebtoken';

export interface IAuthentication extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}
