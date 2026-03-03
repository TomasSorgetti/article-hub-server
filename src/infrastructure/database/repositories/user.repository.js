import {
  RepositoryError,
  AlreadyExistsError,
  NotFoundError,
} from "../../../domain/errors/index.js";
import { UserRepositoryInterface } from "../../../domain/interfaces/repositories/user.repository.interface.js";

class UserRepository extends UserRepositoryInterface {
  #model;

  constructor(model) {
    super();
    this.#model = model;
  }

  async findById(id) {
    try {
      const user = await this.#model
        .findById(id)
        .populate("subscription")
        .lean()
        .exec();
      if (!user) throw new NotFoundError("User not found");
      return user;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.#model
        .findOne({ email })
        .select("+password")
        .lean()
        .exec();
      return user;
    } catch (err) {
      throw new RepositoryError(err.message);
    }
  }

  async findAll(filters = {}) {
    try {
      return await this.#model.find(filters).lean().exec();
    } catch (err) {
      throw new RepositoryError(err.message);
    }
  }

  async create(data) {
    try {
      const user = new this.#model(data);
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (err) {
      if (err.code === 11000) {
        const key = Object.keys(err.keyValue || {})[0] || "Field";
        throw new AlreadyExistsError(`${key} already exists`);
      }
      throw new RepositoryError(err.message);
    }
  }

  async update(id, data) {
    try {
      const user = await this.#model
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!user) throw new NotFoundError("User not found");
      return user;
    } catch (err) {
      if (err.code === 11000) {
        const key = Object.keys(err.keyValue || {})[0] || "Field";
        throw new AlreadyExistsError(`${key} already exists`);
      }
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async delete(id) {
    try {
      const user = await this.#model.findByIdAndDelete(id).lean().exec();
      if (!user) throw new NotFoundError("User not found");
      return { id: user._id };
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }
}

export default UserRepository;
