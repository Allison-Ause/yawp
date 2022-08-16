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
    console.log('ID from getBy', id);
    const { rows } = await pool.query(
      `
      SELECT * FROM restaurants
      WHERE restaurants.id = $1
    `,
      [id]
    );

    return new Restaurant(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `
    SELECT rating, content, email FROM reviews
    INNER JOIN users ON users.id = reviews.user_id
    WHERE reviews.restaurant_id = $1`,
      [this.id]
    );
    return rows;
  }
};
