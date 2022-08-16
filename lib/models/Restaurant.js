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
      INNER JOIN reviews
      ON restaurants.id = reviews.restaurant_id
      WHERE restaurants.id = $1
    `,
      [id]
    );
    console.log('ROWS IS', rows);

    return new Restaurant(rows[0]);
  }
};
