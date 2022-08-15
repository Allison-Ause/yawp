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

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
    SELECT * FROM users
    WHERE email = $1`,
      [email]
    );
    console.log('rows from getByEmail', rows);

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
