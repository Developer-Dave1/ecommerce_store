const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Client } = require('pg');

const productRoutes = require('./routes/productsRoutes');
const cartRoutes = require('./routes/cartRoutes');

const client = new Client({ database: 'ecommerce' });
client.connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.error("Database connection error:", err.stack);
  });


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  store: new pgSession({
    pool: client,
    tableName: 'session'
  }),
  secret: 'yourSuperSecretKey', 
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));


app.use('/products', productRoutes);
app.use('/cart', cartRoutes);


app.get('/', (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.log(`There was an error reaching the index page.`);
    throw error;
  }
});


app.use((req, res) => {
  res.status(404).render('not-found');
});

console.log(`About to listen on port 3000.`);
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
