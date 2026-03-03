import {
  RepositoryError,
  AlreadyExistsError,
  NotFoundError,
} from "../../../domain/errors/index.js";
import { PlanRepositoryInterface } from "../../../domain/interfaces/repositories/plan.repository.interface.js";

export default class PlanRepository extends PlanRepositoryInterface {
  #model;

  constructor(model) {
    super();
    this.#model = model;
  }

  async findById(id) {
    try {
      const plan = await this.#model.findById(id).lean().exec();
      if (!plan) throw new NotFoundError("Plan not found");
      return plan;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async findByName(name) {
    try {
      const plan = await this.#model
        .findOne({ name, isActive: true })
        .lean()
        .exec();
      if (!plan) throw new NotFoundError(`Plan '${name}' not found`);
      return plan;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async findAllActive() {
    try {
      return await this.#model.find({ isActive: true }).lean().exec();
    } catch (err) {
      throw new RepositoryError(err.message);
    }
  }

  async create(planData) {
    try {
      const plan = new this.#model(planData);
      return await plan.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new AlreadyExistsError("Plan with this name already exists");
      }
      throw new RepositoryError(err.message);
    }
  }

  async update(planId, updateData) {
    try {
      const updatedPlan = await this.#model
        .findByIdAndUpdate(planId, updateData, { new: true })
        .lean()
        .exec();
      if (!updatedPlan) throw new NotFoundError("Plan not found for update");
      return updatedPlan;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async deactivate(planId) {
    try {
      const plan = await this.#model
        .findByIdAndUpdate(planId, { isActive: false }, { new: true })
        .lean()
        .exec();
      if (!plan) throw new NotFoundError("Plan not found to deactivate");
      return plan;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }

  async getStripePriceId(planId) {
    try {
      const plan = await this.#model.findById(planId).lean().exec();
      if (!plan) throw new NotFoundError("Plan not found");
      if (!plan.stripePriceId)
        throw new RepositoryError("Stripe price not configured for this plan");
      return plan.stripePriceId;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new RepositoryError(err.message);
    }
  }
}
