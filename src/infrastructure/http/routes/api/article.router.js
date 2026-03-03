import express from "express";
import ArticleValidation from "../../middlewares/validators/article.validators.js";

export default class ArticleRouter {
  #router;
  #controller;
  #authMiddleware;

  constructor({ articleController, authMiddleware }) {
    this.#router = express.Router();
    this.#controller = articleController;
    this.#authMiddleware = authMiddleware.handle.bind(authMiddleware);

    this.#setupRoutes();
  }

  #setupRoutes() {
    /**
     * @GET /api/articles/
     */
    this.#router.get(
      "/",
      ArticleValidation.getAll().handle,
      this.#controller.getAll.bind(this.#controller),
    );
    /**
     * @GET /api/articles/:id
     */
    this.#router.get(
      "/:slug",
      ArticleValidation.getBySlug().handle,
      this.#controller.getPostBySlug.bind(this.#controller),
    );
    /**
     * @POST /api/articles/
     */
    this.#router.post(
      "/",
      // ArticleValidation.create().handle,
      this.#authMiddleware,
      this.#controller.createPost.bind(this.#controller),
    );
    /**
     * @PATCH /api/articles/:slug
     */
    this.#router.patch(
      "/:slug",
      this.#authMiddleware,
      ArticleValidation.update().handle,
      this.#controller.updatePost.bind(this.#controller),
    );
    /**
     * @DELETE /api/articles/:id
     */
    this.#router.delete(
      "/:slug",
      this.#authMiddleware,
      ArticleValidation.delete().handle,
      this.#controller.deletePost.bind(this.#controller),
    );
  }

  getRouter() {
    return this.#router;
  }
}
