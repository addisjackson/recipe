CREATE DATABASE recipe_dev;

\c recipe_dev;

DROP TABLE IF EXISTS favorite_recipes;
DROP TABLE IF EXISTS recipes;

CREATE TABLE IF NOT EXISTS recipes (
  recipe_id SERIAL PRIMARY KEY,
  image_url VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS favorite_recipes (
  favorite_id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES recipes(recipe_id) ON DELETE CASCADE ON UPDATE CASCADE
);
