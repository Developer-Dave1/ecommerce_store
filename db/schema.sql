CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL CHECK(price >= 0),
    quantity INTEGER NOT NULL CHECK(quantity >= 0),
    in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE cart_products (
    cart_id INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK(quantity > 0),
    PRIMARY KEY(cart_id, product_id)
);