const pool = require('../utils/pool');

module.exports = class Restaurant {
  id;
  name;
  cuisine;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.cuisine = row.cuisine;
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM restaurants`);

    return rows.map((row) => new Restaurant(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM restaurants
      WHERE restaurants.id = $1
    `,
      [id]
    );

    return new Restaurant(rows[0]);
  }

  static async searchByName(name) {
    const { rows } = await pool.query(
      `
    SELECT * FROM restaurants
    WHERE name = $1
    `,
      [name]
    );
    return new Restaurant(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `
    SELECT stars, detail, email FROM reviews
    INNER JOIN users ON users.id = reviews.user_id
    WHERE reviews.restaurant_id = $1`,
      [this.id]
    );
    return rows;
  }
};
