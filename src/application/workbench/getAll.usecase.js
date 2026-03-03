export default class getAllWorkbenchesUseCase {
  #workbenchRepository;
  #workbenchFactory;

  constructor({ workbenchRepository, workbenchFactory }) {
    this.#workbenchRepository = workbenchRepository;
    this.#workbenchFactory = workbenchFactory;
  }

  async execute(userId) {
    const workbenches = await this.#workbenchRepository.findByUserId(userId);

    return workbenches.map((workbench) =>
      this.#workbenchFactory.create(workbench).sanitized(),
    );
  }
}
