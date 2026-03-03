export default class createWorkbenchUseCase {
  #workbenchRepository;
  #workbenchFactory;

  constructor({ workbenchRepository, workbenchFactory }) {
    this.#workbenchRepository = workbenchRepository;
    this.#workbenchFactory = workbenchFactory;
  }

  async execute({ userId, name, description }) {
    const workbenchEntity = this.#workbenchFactory.create({
      name,
      owner: userId,
      description,
    });

    const rawWorkbench = await this.#workbenchRepository.create(
      workbenchEntity.toObject(),
    );

    const populated = await this.#workbenchRepository.findById(
      rawWorkbench._id || rawWorkbench.id,
    );

    const sanitized = this.#workbenchFactory.create(populated).sanitized();

    return sanitized;
  }
}
