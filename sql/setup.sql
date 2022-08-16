-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users, restaurants, reviews CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  passwordHash VARCHAR NOT NULL
);

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  cuisine VARCHAR
);

CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating SMALLINT CONSTRAINT five_star_scale CHECK(rating BETWEEN 1 AND 5),
  content VARCHAR NOT NULL,
  user_id BIGINT,
  restaurant_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);


INSERT INTO users (email, passwordHash) VALUES
('polly@pocket.com', 'fakePasswordHash'),
('barbie@skipper.com', 'fakePasswordHash'),
('kylo@ren.com', 'fakePasswordHash'),
('allison@works.com', '$2b$10$ppw7JtE6dIWepG7/a32TsO2icC6/SJX7O3jjzSlFK8zhL4LuYe5AG');

INSERT INTO restaurants (name, cuisine) VALUES
('Tropicale', 'Colombian'),
('Nostrana', 'Italian'),
('Bar Bar', 'Americana');

INSERT INTO reviews (rating, content, user_id, restaurant_id) VALUES
(5, 'Delicious pinaepple pina coladas and a good price point!', 1, 1),
(5, 'Totally cute atmosphere and incredibly authentic fare', 2, 1),
(2, 'Cold pizza and mean waitstaff', 2, 2),
(1, 'Uptight atmosphere; too bougie for comfort', 3, 2),
(4, 'Gorgeous patio and ethically sourced meat', 4, 3),
(3, 'Too sweet cocktails but awesome cajun fries!', 1, 3);






