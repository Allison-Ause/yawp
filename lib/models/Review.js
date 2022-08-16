const pool = require('../utils/pool');

module.exports = class Review {
  id;
  rating;
  content;
  user_id;
  restaurant_id;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.content = row.content;
    this.user_id = row.user_id;
    this.restaurant_id = row.restaurant_id;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM reviews
    WHERE id = $1
    `,
      [id]
    );
    console.log('ROWS', rows);
    return new Review(rows[0]);
  }

  static async insert({ rating, content, user_id, restaurant_id }) {
    const { rows } = await pool.query(
      `
    INSERT INTO reviews (rating, content, user_id, restaurant_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [rating, content, user_id, restaurant_id]
    );
    return new Review(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
    DELETE FROM reviews
    WHERE id = $1
    RETURNING *
    `,
      [id]
    );
    return new Review(rows[0]);
  }
};
