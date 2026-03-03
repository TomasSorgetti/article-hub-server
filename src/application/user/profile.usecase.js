import UserEntity from "../../domain/entities/user.entity.js";

export default class GetProfileUseCase {
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.#userRepository.findById(userId);

    const userEntity = new UserEntity(user);
    const sanitized = userEntity.sanitized();

    return sanitized;
  }
}
