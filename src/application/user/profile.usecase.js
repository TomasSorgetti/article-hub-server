export default class GetProfileUseCase {
  #userRepository;
  #userFactory;

  constructor({ userRepository, userFactory }) {
    this.#userRepository = userRepository;
    this.#userFactory = userFactory;
  }

  async execute(userId) {
    const user = await this.#userRepository.findById(userId);

    const userEntity = this.#userFactory.create(user);
    const sanitized = userEntity.sanitized();

    return sanitized;
  }
}
