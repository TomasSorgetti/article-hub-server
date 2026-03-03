import {
  RepositoryError,
  AlreadyExistsError,
  NotFoundError,
} from "../../../domain/errors/index.js";
import { SessionRepositoryInterface } from "../../../domain/interfaces/repositories/session.repository.interface.js";

class SessionRepository extends SessionRepositoryInterface {
  #model;

  constructor(model) {
    super();
    this.#model = model;
  }

  async create(data) {
    try {
      const session = new this.#model(data);
      const savedSession = await session.save();
      return savedSession.toObject();
    } catch (err) {
      if (err.code === 11000) {
        const key = Object.keys(err.keyValue || {})[0] || "Field";
        throw new AlreadyExistsError(`${key} already exists`);
      }
      throw new RepositoryError(err.message);
    }
  }

  async findById(id) {
    try {
      const session = await this.#model.findById(id).lean();
      if (!session) throw new NotFoundError("Session not found");
      return session;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async findByUserId(userId, filter = {}) {
    try {
      const sessions = await this.#model.find({ userId, ...filter }).lean();
      return sessions;
    } catch (err) {
      throw new RepositoryError(err.message);
    }
  }

  async findByRefreshToken(refreshToken) {
    try {
      const session = await this.#model.findOne({ refreshToken }).lean();
      if (!session) throw new NotFoundError("Session not found");
      return session;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async update(id, data) {
    try {
      const updated = await this.#model
        .findByIdAndUpdate(id, data, { new: true })
        .lean();
      if (!updated) throw new NotFoundError("Session not found");
      return updated;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async invalidate(id) {
    try {
      const session = await this.#model
        .findByIdAndUpdate(id, { isValid: false }, { new: true })
        .lean();
      if (!session) throw new NotFoundError("Session not found");
      return session;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async deleteByRefreshToken(refreshToken) {
    try {
      const deleted = await this.#model
        .findOneAndDelete({ refreshToken })
        .lean();
      if (!deleted) throw new NotFoundError("Session not found");
      return deleted;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async deleteByUserId(userId) {
    try {
      const result = await this.#model.deleteMany({ userId });

      if (result.deletedCount === 0) {
        throw new NotFoundError("No sessions found for this user");
      }

      return result; // opcional: podés devolver { deletedCount: result.deletedCount }
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async deleteById(id) {
    try {
      const deleted = await this.#model.findOneAndDelete({ _id: id }).lean();
      if (!deleted) throw new NotFoundError("Session not found");
      return deleted;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }
}

export default SessionRepository;
