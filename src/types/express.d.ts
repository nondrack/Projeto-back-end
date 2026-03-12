export {};

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id_usuario: number;
        email: string;
        tipo_usuario: string;
      };
    }
  }
}
