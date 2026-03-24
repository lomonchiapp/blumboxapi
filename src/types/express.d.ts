import type { AuthContext } from "@/common/guards/combined-auth.guard";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
