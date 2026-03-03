import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetMyNotificationsUseCase from "../../../src/application/notification/getMyNotifications.usecase.js";

describe("GetMyNotificationsUseCase", () => {
  let notificationRepository;
  let getMyNotificationsUseCase;

  beforeEach(() => {
    notificationRepository = { findByUser: jest.fn() };
    getMyNotificationsUseCase = new GetMyNotificationsUseCase({
      notificationRepository,
    });
  });

  it("should successfully return notifications", async () => {
    const mockData = [{ id: "n1", message: "Hello" }];
    notificationRepository.findByUser.mockResolvedValue(mockData);

    const result = await getMyNotificationsUseCase.execute({ userId: "u123" });

    expect(result.length).toBe(1);
    expect(notificationRepository.findByUser).toHaveBeenCalledWith("u123");
  });
});
