import UserEntity from "../../domain/entities/user.entity.js";
import { NotFoundError } from "../../domain/errors/index.js";
import path from "path";

export default class UpdateProfileUseCase {
  #userRepository;
  #storageService;

  constructor({ userRepository, storageService }) {
    this.#userRepository = userRepository;
    this.#storageService = storageService;
  }

  async execute(userId, userData, file) {
    let avatarUrl = null;
    let storedFilename = null;
    let oldAvatarFilename = null;

    try {
      const existingUser = await this.#userRepository.findById(userId);
      if (!existingUser) throw new NotFoundError("User not found");

      const validatedData = UserEntity.validateUpdate(userData);

      if (file) {
        storedFilename = `${Date.now()}-${file.originalname}`;
        await this.#storageService.upload(file, storedFilename);
        avatarUrl = this.#storageService.getUrl(storedFilename);

        if (existingUser.avatar) {
          oldAvatarFilename = path.basename(existingUser.avatar);
        }
      }

      const updateData = {
        ...validatedData,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      const updatedUser = await this.#userRepository.update(userId, updateData);
      if (!updatedUser) throw new NotFoundError("User not found");

      if (oldAvatarFilename) {
        await this.#storageService.delete(oldAvatarFilename).catch((err) => {
          console.error("Failed to delete old avatar:", err);
        });
      }

      return new UserEntity(updatedUser).sanitized();
    } catch (error) {
      if (storedFilename) {
        await this.#storageService.delete(storedFilename).catch((err) => {
          console.error("Failed to delete image after update failure:", err);
        });
      }
      throw error;
    }
  }
}
