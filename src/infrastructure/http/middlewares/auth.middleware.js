import {
  UnauthorizedError,
  BadRequestError,
} from "../../../domain/errors/index.js";

export default class AuthMiddleware {
  constructor({ jwtService }) {
    this.jwtService = jwtService;
  }

  handle(req, res, next) {
    try {
      const token = req.cookies?.accessToken;
      if (!token) throw new BadRequestError("Access token required");

      const payload = this.jwtService.verifyAccess(token);
      if (!payload.userId) throw new UnauthorizedError("Invalid token payload");

      req.user = {
        id: payload.userId.toString(),
        sessionId: payload.sessionId.toString(),
        rememberMe: payload.rememberMe || false,
      };

      next();
    } catch (err) {
      if (err instanceof BadRequestError || err instanceof UnauthorizedError) {
        next(err);
      } else {
        next(new UnauthorizedError("Invalid or expired access token"));
      }
    }
  }
}
