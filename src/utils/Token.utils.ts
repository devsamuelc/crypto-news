export class TokenUtils {
  public static extractBearerToken(bearerToken?: string): string | null {
    const [type, token] = bearerToken?.split(' ') || [];
    return type === 'Bearer' ? token : null;
  }
}
