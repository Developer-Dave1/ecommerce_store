-- Create sample users
INSERT INTO users (username, password)
VALUES 
  ('alice', 'hashedpassword1'),
  ('bob', 'hashedpassword2');

-- Create sample carts (linked to users)
INSERT INTO cart (user_id)
VALUES 
  (1), -- alice
  (2); -- bob

-- Add some products
INSERT INTO products (product_name, price, quantity, in_stock)
VALUES 
  ('T-Shirt', 19.99, 100, TRUE),
  ('Sneakers', 59.95, 50, TRUE),
  ('Backpack', 34.50, 25, TRUE),
  ('Hat', 14.75, 0, FALSE);

-- Add products to carts
INSERT INTO cart_products (cart_id, product_id, quantity)
VALUES
  (1, 1, 2),  -- Alice has 2 T-Shirts
  (1, 3, 1),  -- Alice has 1 Backpack
  (2, 2, 1),  -- Bob has 1 pair of Sneakers
  (2, 4, 1);  -- Bob has 1 Hat (even though it's out of stock)
