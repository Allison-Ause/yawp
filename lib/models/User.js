const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.passwordhash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
    INSERT INTO users 
    (email, passwordhash) VALUES ($1, $2)
    RETURNING *
    `,
      [email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM users
    WHERE id = $1
    `,
      [id]
    );
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
    SELECT * FROM users
    WHERE email = $1`,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getAllUsers() {
    const { rows } = await pool.query(`
    SELECT * from users
    `);

    return rows.map((row) => new User(row));
  }

  async getUserReviews() {
    const { rows } = await pool.query(
      `
    SELECT rating, content FROM reviews
    INNER JOIN users on users.id = reviews.user_id
    WHERE users.id = $1
    `,
      [this.id]
    );
    return rows;
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
