import { describe, it, expect } from "@jest/globals";
import UserFactory from "../../../src/domain/factories/user.factory.js";
import ArticleFactory from "../../../src/domain/factories/article.factory.js";
import WorkbenchFactory from "../../../src/domain/factories/workbench.factory.js";
import UserEntity from "../../../src/domain/entities/user.entity.js";
import ArticleEntity from "../../../src/domain/entities/article.entity.js";
import WorkbenchEntity from "../../../src/domain/entities/workbench.entity.js";

describe("Domain Factories", () => {
  const userFactory = new UserFactory();
  const articleFactory = new ArticleFactory();
  const workbenchFactory = new WorkbenchFactory();

  describe("UserFactory", () => {
    it("should create a UserEntity instance", () => {
      const user = userFactory.create({
        username: "testuser",
        email: "test@test.com",
      });
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.username).toBe("testuser");
    });

    it("should correctly handle _id from database objects", () => {
      const user = userFactory.create({
        _id: "db_id_123",
        username: "testuser",
        email: "test@test.com",
      });
      expect(user.id).toBe("db_id_123");
    });

    it("should create an admin user", () => {
      const admin = userFactory.createAdmin({
        username: "admin",
        email: "admin@test.com",
      });
      expect(admin.role).toBe("admin");
    });
  });

  describe("ArticleFactory", () => {
    it("should create an ArticleEntity instance", () => {
      const article = articleFactory.create({
        title: "Test Article Factory",
        slug: "test-article-factory",
        content: "factory content",
        summary: "factory summary",
        workbench: "wb123",
        author: "u1",
      });
      expect(article).toBeInstanceOf(ArticleEntity);
      expect(article.title).toBe("Test Article Factory");
    });
  });

  describe("WorkbenchFactory", () => {
    it("should create a WorkbenchEntity instance", () => {
      const workbench = workbenchFactory.create({
        name: "Factory Workbench",
        description: "factory description",
        owner: "user123",
      });
      expect(workbench).toBeInstanceOf(WorkbenchEntity);
      expect(workbench.name).toBe("Factory Workbench");
    });
  });
});
