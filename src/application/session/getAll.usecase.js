export default class GetAllSessionsUseCase {
  #sessionRepository;
  #sessionFactory;

  constructor({ sessionRepository, sessionFactory }) {
    this.#sessionRepository = sessionRepository;
    this.#sessionFactory = sessionFactory;
  }

  async execute(userId) {
    const sessions = await this.#sessionRepository.findByUserId(userId);

    return sessions.map((s) => this.#sessionFactory.create(s).sanitized());
  }
}
