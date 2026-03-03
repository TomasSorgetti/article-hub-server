import { ForbiddenError, NotFoundError } from "../../domain/errors/index.js";

export default class deleteWorkbenchUseCase {
  #workbenchRepository;

  constructor({ workbenchRepository }) {
    this.#workbenchRepository = workbenchRepository;
  }

  async execute({ userId, workbenchId }) {
    const workbench = await this.#workbenchRepository.findById(workbenchId);

    if (!workbench) {
      throw new NotFoundError("Workbench not found");
    }

    const ownerId =
      workbench.owner._id?.toString() || workbench.owner.toString();

    if (ownerId !== userId) {
      throw new ForbiddenError("Only the owner can delete this workbench");
    }

    return await this.#workbenchRepository.delete(workbenchId);
  }
}
