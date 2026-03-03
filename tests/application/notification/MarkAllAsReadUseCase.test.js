import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import MarkAllAsReadUseCase from "../../../src/application/notification/markAllAsRead.usecase.js";

describe("MarkAllAsReadUseCase", () => {
  let notificationRepository;
  let markAllAsReadUseCase;

  beforeEach(() => {
    notificationRepository = { markAllAsRead: jest.fn() };
    markAllAsReadUseCase = new MarkAllAsReadUseCase({ notificationRepository });
  });

  it("should successfully mark all as read", async () => {
    notificationRepository.markAllAsRead.mockResolvedValue({
      acknowledged: true,
    });
    const result = await markAllAsReadUseCase.execute({ userId: "u1" });
    expect(result.acknowledged).toBe(true);
    expect(notificationRepository.markAllAsRead).toHaveBeenCalledWith("u1");
  });
});
