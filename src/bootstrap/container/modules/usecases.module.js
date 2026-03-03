// auth
import LoginUseCase from "../../../application/auth/login.usecase.js";
import RegisterUseCase from "../../../application/auth/register.usecase.js";
import VerifyUseCase from "../../../application/auth/verify.usecase.js";
import LogoutUseCase from "../../../application/auth/logout.usecase.js";
import RefreshUseCase from "../../../application/auth/refresh.usecase.js";
import LoginWithGoogleUseCase from "../../../application/auth/loginWithGoogle.usecase.js";
// user
import GetProfileUseCase from "../../../application/user/profile.usecase.js";
import UpdateProfileUseCase from "../../../application/user/update.usecase.js";
// session
import GetAllSessionsUseCase from "../../../application/session/getAll.usecase.js";
import DeleteAllSessionsUseCase from "../../../application/session/deleteAll.usecase.js";
import DeleteSessionUseCase from "../../../application/session/delete.usecase.js";
// workbench
import getAllWorkbenchesUseCase from "../../../application/workbench/getAll.usecase.js";
import createWorkbenchUseCase from "../../../application/workbench/create.usecase.js";
import DeleteWorkbenchUseCase from "../../../application/workbench/delete.usecase.js";
// article
import GetArticlesUseCase from "../../../application/article/getArticles.usecase.js";
import GetArticleUseCase from "../../../application/article/getArticle.usecase.js";
import CreateArticleUseCase from "../../../application/article/createArticle.usecase.js";
import UpdateArticleUseCase from "../../../application/article/updateArticle.usecase.js";
import DeleteArticleUseCase from "../../../application/article/deleteArticle.usecase.js";
// category
import GetAllCategoriesUseCase from "../../../application/category/getAll.usecase.js";
import GetCategoryUseCase from "../../../application/category/getOne.usecase.js";
import CreateCategoryUseCase from "../../../application/category/create.usecase.js";
import UpdateCategoryUseCase from "../../../application/category/update.usecase.js";
import DeleteCategoryUseCase from "../../../application/category/delete.usecase.js";
// subscription
import GetMySubscriptionUseCase from "../../../application/subscription/getMySubscription.usecase.js";
import CreateSubscriptionUseCase from "../../../application/subscription/createSubscription.usecase.js";
import StripeCheckoutUseCase from "../../../application/subscription/stripeCheckout.usecase.js";
import StripeVerifySessionUseCase from "../../../application/subscription/verifyStripeSession.usecase.js";
// notification
import GetMyNotificationsUseCase from "../../../application/notification/getMyNotifications.usecase.js";
import DeleteOneNotificationUseCase from "../../../application/notification/deleteOneNotification.usecase.js";
import MarkAllAsReadUseCase from "../../../application/notification/markAllAsRead.usecase.js";
// plan
import GetAllPlansUseCase from "../../../application/plan/getAll.usecase.js";

export const registerUseCases = (container, config) => {
  const resolveDependency = (name) => container.resolve(name);

  // auth
  container.register(
    "loginUseCase",
    new LoginUseCase({
      userRepository: resolveDependency("userRepository"),
      sessionRepository: resolveDependency("sessionRepository"),
      jwtService: resolveDependency("jwtService"),
      hashService: resolveDependency("hashService"),
    }),
  );

  container.register(
    "registerUseCase",
    new RegisterUseCase({
      userRepository: resolveDependency("userRepository"),
      subscriptionRepository: resolveDependency("subscriptionRepository"),
      planRepository: resolveDependency("planRepository"),
      workbenchRepository: resolveDependency("workbenchRepository"),
      emailService: resolveDependency("emailService"),
      emailQueueService: resolveDependency("emailQueueService"),
      hashService: resolveDependency("hashService"),
      jwtService: resolveDependency("jwtService"),
      env: config.env,
    }),
  );

  container.register(
    "verifyUseCase",
    new VerifyUseCase({
      userRepository: resolveDependency("userRepository"),
      jwtService: resolveDependency("jwtService"),
    }),
  );

  container.register(
    "logoutUseCase",
    new LogoutUseCase({
      sessionRepository: resolveDependency("sessionRepository"),
    }),
  );

  container.register(
    "refreshUseCase",
    new RefreshUseCase({
      sessionRepository: resolveDependency("sessionRepository"),
      jwtService: resolveDependency("jwtService"),
      hashService: resolveDependency("hashService"),
    }),
  );

  container.register(
    "loginWithGoogleUseCase",
    new LoginWithGoogleUseCase({
      userRepository: resolveDependency("userRepository"),
      sessionRepository: resolveDependency("sessionRepository"),
      jwtService: resolveDependency("jwtService"),
      hashService: resolveDependency("hashService"),
      googleStrategy: resolveDependency("googleAuthStrategy"),
      notificationRepository: resolveDependency("notificationRepository"),
      socketService: resolveDependency("socketService"),
    }),
  );

  // user
  container.register(
    "getProfileUseCase",
    new GetProfileUseCase({
      userRepository: resolveDependency("userRepository"),
    }),
  );

  container.register(
    "updateProfileUseCase",
    new UpdateProfileUseCase({
      userRepository: resolveDependency("userRepository"),
      storageService: resolveDependency("storageService"),
    }),
  );

  // session
  container.register(
    "getAllSessionsUseCase",
    new GetAllSessionsUseCase({
      sessionRepository: resolveDependency("sessionRepository"),
    }),
  );
  container.register(
    "deleteAllSessionsUseCase",
    new DeleteAllSessionsUseCase({
      sessionRepository: resolveDependency("sessionRepository"),
    }),
  );
  container.register(
    "deleteSessionUseCase",
    new DeleteSessionUseCase({
      sessionRepository: resolveDependency("sessionRepository"),
    }),
  );

  // workbench
  container.register(
    "getAllWorkbenchesUseCase",
    new getAllWorkbenchesUseCase({
      workbenchRepository: resolveDependency("workbenchRepository"),
    }),
  );
  container.register(
    "createWorkbenchUseCase",
    new createWorkbenchUseCase({
      workbenchRepository: resolveDependency("workbenchRepository"),
    }),
  );
  container.register(
    "deleteWorkbenchUseCase",
    new DeleteWorkbenchUseCase({
      workbenchRepository: resolveDependency("workbenchRepository"),
    }),
  );

  // article
  container.register(
    "getArticlesUseCase",
    new GetArticlesUseCase({
      articleRepository: resolveDependency("articleRepository"),
    }),
  );
  container.register(
    "getArticleUseCase",
    new GetArticleUseCase({
      articleRepository: resolveDependency("articleRepository"),
      socketService: resolveDependency("socketService"),
    }),
  );
  container.register(
    "createArticleUseCase",
    new CreateArticleUseCase({
      articleRepository: resolveDependency("articleRepository"),
      workbenchRepository: resolveDependency("workbenchRepository"),
      notificationRepository: resolveDependency("notificationRepository"),
      socketService: resolveDependency("socketService"),
    }),
  );
  container.register(
    "updateArticleUseCase",
    new UpdateArticleUseCase({
      articleRepository: resolveDependency("articleRepository"),
      notificationRepository: resolveDependency("notificationRepository"),
      socketService: resolveDependency("socketService"),
    }),
  );
  container.register(
    "deleteArticleUseCase",
    new DeleteArticleUseCase({
      articleRepository: resolveDependency("articleRepository"),
      notificationRepository: resolveDependency("notificationRepository"),
      socketService: resolveDependency("socketService"),
    }),
  );

  // category
  container.register(
    "getAllCategoriesUseCase",
    new GetAllCategoriesUseCase({
      categoryRepository: resolveDependency("categoryRepository"),
    }),
  );
  container.register(
    "getCategoryUseCase",
    new GetCategoryUseCase({
      categoryRepository: resolveDependency("categoryRepository"),
    }),
  );
  container.register(
    "createCategoryUseCase",
    new CreateCategoryUseCase({
      categoryRepository: resolveDependency("categoryRepository"),
    }),
  );
  container.register(
    "updateCategoryUseCase",
    new UpdateCategoryUseCase({
      categoryRepository: resolveDependency("categoryRepository"),
    }),
  );
  container.register(
    "deleteCategoryUseCase",
    new DeleteCategoryUseCase({
      categoryRepository: resolveDependency("categoryRepository"),
    }),
  );

  // subscription
  container.register(
    "getMySubscriptionUseCase",
    new GetMySubscriptionUseCase({
      subscriptionRepository: resolveDependency("subscriptionRepository"),
    }),
  );
  container.register(
    "createSubscriptionUseCase",
    new CreateSubscriptionUseCase({
      subscriptionRepository: resolveDependency("subscriptionRepository"),
      userRepository: resolveDependency("userRepository"),
      stripeService: resolveDependency("stripeService"),
    }),
  );
  container.register(
    "stripeCheckoutUseCase",
    new StripeCheckoutUseCase({
      planRepository: resolveDependency("planRepository"),
      userRepository: resolveDependency("userRepository"),
      stripeService: resolveDependency("stripeService"),
      env: config.env,
    }),
  );
  container.register(
    "stripeVerifySessionUseCase",
    new StripeVerifySessionUseCase({
      subscriptionRepository: resolveDependency("subscriptionRepository"),
      stripeService: resolveDependency("stripeService"),
    }),
  );

  // notifications
  container.register(
    "getMyNotificationsUseCase",
    new GetMyNotificationsUseCase({
      notificationRepository: resolveDependency("notificationRepository"),
    }),
  );
  container.register(
    "deleteOneNotificationUseCase",
    new DeleteOneNotificationUseCase({
      notificationRepository: resolveDependency("notificationRepository"),
    }),
  );
  container.register(
    "markAllAsReadUseCase",
    new MarkAllAsReadUseCase({
      notificationRepository: resolveDependency("notificationRepository"),
    }),
  );

  // plan
  container.register(
    "getAllPlansUseCase",
    new GetAllPlansUseCase({
      planRepository: resolveDependency("planRepository"),
    }),
  );
};
