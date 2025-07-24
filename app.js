const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Client } = require('pg');
const config = require("./lib/config");

const PORT = config.PORT;
const HOST = config.HOST;

const isProduction = process.env.NODE_ENV === 'production';


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
console.log('DATABASE_URL:', process.env.DATABASE_URL);

client.connect()
  .then(() => console.log('Database connected'))
  .catch(error => console.error(`DB Connection Error: ${error.name} - ${error.message}`));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
  store: new pgSession({
    client: client,  
    tableName: 'session'
  }),
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: isProduction,
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


const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productsRoutes');

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/', userRoutes);

app.use((req, res) => {
  res.status(404).render('not-found');
});


console.log(`About to listen on port ${PORT}`);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
