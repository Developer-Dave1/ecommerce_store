const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const config = require("./lib/config");
const client = require('./lib/client');

const PORT = config.PORT;
const HOST = config.HOST;

const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const isProduction = config.NODE_ENV === "production";

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  store: new pgSession({
    pool: client,
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
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);
app.use('/', userRoutes);
app.use((req, res) => {
  res.status(404).render('not-found');
});

app.listen(PORT, () => console.log(`🚀 Listening on http://${HOST}:${PORT}`));
