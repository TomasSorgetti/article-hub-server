import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteOneNotificationUseCase from "../../../src/application/notification/deleteOneNotification.usecase.js";

describe("DeleteOneNotificationUseCase", () => {
  let notificationRepository;
  let deleteOneNotificationUseCase;

  beforeEach(() => {
    notificationRepository = { delete: jest.fn() };
    deleteOneNotificationUseCase = new DeleteOneNotificationUseCase({
      notificationRepository,
    });
  });

  it("should successfully delete a single notification", async () => {
    notificationRepository.delete.mockResolvedValue({ acknowledged: true });
    const result = await deleteOneNotificationUseCase.execute({
      userId: "u1",
      id: "n1",
    });
    expect(result.acknowledged).toBe(true);
    expect(notificationRepository.delete).toHaveBeenCalledWith("n1");
  });
});
