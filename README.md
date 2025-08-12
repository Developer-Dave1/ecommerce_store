# 🛒 Essentials — A Node.js E-Commerce Store

**Essentials** is a full-stack e-commerce web app built with **Node.js**, **Express**, **PostgreSQL**, and **Pug**. It supports user authentication, product browsing, cart management, and review functionality — all styled in a clean and responsive UI.

---

## 🚀 Features

- 🔐 User login and signup with hashed passwords
- 🛍️ Browse products by category or view all
- 🛒 Add/remove products to/from your cart
- ✅ Flash messaging for user feedback (e.g., login, errors, success)
- ✍️ Submit and delete reviews on products
- 🧰 Admin panel to manage products (edit, delete, update quantity/description)

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Templating:** Pug
- **Sessions:** `express-session` + `connect-pg-simple`
- **Validation:** `express-validator`
- **Flash Messaging:** `express-flash`
- **Password Hashing:** `bcryptjs`

---

## ⚙️ Getting Started

unzip essentials-app.zip
cd essentials-app

### 🔧 Install Dependencies

```bash
npm install
```

### 🗄️ Set Up the Database with the name "ecommerce_test"

**Create tables:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(50) NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK(price >= 0),
  quantity INTEGER NOT NULL CHECK(quantity >= 0),
  image_url TEXT,
  product_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  UNIQUE (user_id, product_id)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  username VARCHAR(50)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

```

### 🌱 Seed Sample Products

```sql
INSERT INTO products (product_name, price, quantity, image_url, product_type, description) VALUES
    ('Classic Hoodie', 39.99, 25, '/images/products/classichoodie.jpg', 'clothing', 'Finally block out your neighbors saxophone practice, your coworkers loud phone calls, and that one mystery bird outside your window at 5 a.m. Slip these on, and enjoy your own personal silent movie — starring you, ignoring the world.'),
    ('Wireless Mouse', 24.99, 50, '/images/products/wirelessmouse.jpg', 'electronics', ' Finally cut the cord — no more getting tangled like last nights spaghetti. Smooth, fast, and so precise it might just help you finally hit "save" instead of "close without saving." Your desks new best friend.'),
    ('USB-C Charger 65W', 29.99, 40, 'images/products/usbcharger.jpg', 'electronics', 'No description need here. You know what it does and you know you need it.'),
    ('Noise Cancelling Headphones', 89.95, 15, '/images/products/headphones.jpg', 'electronics', 'Finally block out your neighbors saxophone practice, your coworkers loud phone calls, and that one mystery bird outside your window at 5 a.m. Slip these on, and enjoy your own personal silent movie — starring you, ignoring the world.'),
    ('Stainless Steel Water Bottle', 19.99, 60, '/images/products/waterbottle.jpg', 'wellness', 'This sleek stainless steel water bottle keeps your drinks icy cold or lava-level hot for hours — because nobody likes lukewarm coffee or sad, tepid water. Take it to the gym, the office, or on your quest to finally fold that pile of laundry. Hydrate like a champ!'),
    ('Laptop Backpack', 49.99, 20, '/images/products/backpack.jpg', 'general', 'Carries your laptop, snacks, and questionable life choices — all in one sleek, comfy package. Great for commuting, traveling, or just pretending youre organized. Bonus: it makes you look like you actually know where youre going.'),
    ('Yoga Mat', 25.00, 30, '/images/products/yogamat.jpg', 'wellness', 'Look, its a yoga mat. Its not going to align your chakras for you or whisper sweet “oms” in your ear — but it will keep your knees from crying during cat-cow'),
    ('Bluetooth Speaker', 34.99, 10, ' /images/products/bluetoothspeaker.jpg', 'electronics', 'Turns any room, park, or shower into your personal concert venue. Crisp sound, deep bass, and zero awkward aux cord fights. Just beware: once you hit play, your friends might never leave.'),
    ('Portable SSD 1TB', 99.99, 0, '/images/products/ssdharddrive.jpg', 'electronics', 'Tiny enough to fit in your pocket, but big enough to hold all your photos, movies, unfinished novels, and that giant folder labeled "Important Stuff." Sure it is. Anyway, fast, sleek, and so reliable you will wonder why you ever trusted those old dusty hard drives.');

```
sql

### 🌱 Seed Test User <<------
```sql
INSERT INTO users (username, password) VALUES ('testuser', '$2b$10$rcdoc9DuaB/KBNqy1L8Kxu9yKngtF74G1ERjvUvSE5nPP2wQspab6');
```


---

## ▶️ Run the App

```bash
npm start
Login:
  username: testuser
  password: mypassword
```

Then open your browser and visit:  
👉 `http://localhost:3000`

---

