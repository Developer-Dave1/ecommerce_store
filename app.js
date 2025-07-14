const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Client } = require('pg');

const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productsRoutes');

const client = new Client({ database: 'ecommerce' });
client.connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch(error => {
    console.error(`Database connection error: ${error.name} - ${error.message}`);
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
  secret: 'secret key', 
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.username = req.session.username;
  next();
});

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/', userRoutes);


//app.get('/', (req, res) => {
//  try {
//    res.render('login');
//  } catch (error) {
//    console.log(`There was an error reaching the index page.`);
//    throw error;
//  }
//});


app.use((req, res) => {
  res.status(404).render('not-found');
});

console.log(`About to listen on port 3000.`);
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
