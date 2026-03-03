export default class createCategoryUseCase {
  #categoryRepository;
  #categoryFactory;

  constructor({ categoryRepository, categoryFactory }) {
    this.#categoryRepository = categoryRepository;
    this.#categoryFactory = categoryFactory;
  }

  async execute({ name, userId, isGlobal = false }) {
    const categoryEntity = this.#categoryFactory.create({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      createdBy: userId,
      isGlobal,
    });

    const category = await this.#categoryRepository.create(
      categoryEntity.toObject(),
    );

    return category;
  }
}
