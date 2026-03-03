import UserFactory from "../../../domain/factories/user.factory.js";
import ArticleFactory from "../../../domain/factories/article.factory.js";
import CategoryFactory from "../../../domain/factories/category.factory.js";
import SessionFactory from "../../../domain/factories/session.factory.js";
import SubscriptionFactory from "../../../domain/factories/subscription.factory.js";
import WorkbenchFactory from "../../../domain/factories/workbench.factory.js";
import NotificationFactory from "../../../domain/factories/notification.factory.js";

export const registerFactories = (container) => {
  container.register("userFactory", new UserFactory());
  container.register("articleFactory", new ArticleFactory());
  container.register("categoryFactory", new CategoryFactory());
  container.register("sessionFactory", new SessionFactory());
  container.register("subscriptionFactory", new SubscriptionFactory());
  container.register("workbenchFactory", new WorkbenchFactory());
  container.register("notificationFactory", new NotificationFactory());
};
