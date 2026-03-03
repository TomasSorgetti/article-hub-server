import {
  RepositoryError,
  AlreadyExistsError,
  NotFoundError,
} from "../../../domain/errors/index.js";
import { ApiKeyRepositoryInterface } from "../../../domain/interfaces/repositories/apikey.repository.interface.js";

export default class ApiKeyRepository extends ApiKeyRepositoryInterface {
  #model;

  constructor(model) {
    super();
    this.#model = model;
  }

  async create({ key, userId, workbenchId, name, scopes, expiresAt }) {
    try {
      const exists = await this.#model.findOne({ key });
      if (exists) throw new AlreadyExistsError("API key already exists");

      const apiKey = await this.#model.create({
        key,
        userId,
        workbenchId,
        name,
        scopes,
        expiresAt,
      });
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof AlreadyExistsError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async getById(id) {
    try {
      const apiKey = await this.#model.findById(id);
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async getByKey(key) {
    try {
      const apiKey = await this.#model.findOne({ key });
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async listByUser(userId) {
    try {
      const apiKeys = await this.#model
        .find({ userId })
        .sort({ createdAt: -1 });
      return apiKeys.map((k) => k.toObject());
    } catch (error) {
      throw new RepositoryError(error.message);
    }
  }

  async validate(key) {
    try {
      const apiKey = await this.#model.findOne({ key, isActive: true });
      if (!apiKey) throw new NotFoundError("API key not found or inactive");

      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        throw new RepositoryError("API key expired");
      }

      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async deactivate(key) {
    try {
      const apiKey = await this.#model.findOneAndUpdate(
        { key },
        { isActive: false },
        { new: true },
      );
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async activate(key) {
    try {
      const apiKey = await this.#model.findOneAndUpdate(
        { key },
        { isActive: true },
        { new: true },
      );
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async delete(key) {
    try {
      const apiKey = await this.#model.findOneAndDelete({ key });
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }

  async deleteAllByUser(userId) {
    try {
      await this.#model.deleteMany({ userId });
      return true;
    } catch (error) {
      throw new RepositoryError(error.message);
    }
  }

  async regenerate(oldKey, newKey) {
    try {
      const apiKey = await this.#model.findOneAndUpdate(
        { key: oldKey },
        { key: newKey },
        { new: true },
      );
      if (!apiKey) throw new NotFoundError("API key not found");
      return apiKey.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new RepositoryError(error.message);
    }
  }
}
