# Essentials — E-commerce Portfolio Project

Essentials is a full-stack e-commerce application built with React, TypeScript, Node.js, Express, and PostgreSQL. It combines a product storefront with session-based authentication, customer reviews, and role-protected product editing.

**Status:** In development. The React storefront integrates with authentication, product listing, reviews, and admin editing. Persistent cart integration and parts of the transition from a Pug application to a React client remain incomplete. Checkout and payments are not implemented.

## Features

### React storefront

- Log in and log out using server-managed sessions.
- Browse product cards and view product images, prices, descriptions, and availability.
- Add and remove cart items, with an item-count badge and stock checks against the loaded inventory.
- Read product reviews, submit one review per user per product, and delete your own review.
- Edit product names, prices, quantities, and descriptions as an administrator, with validation in the client and server.
- Use a Bootstrap-based interface with responsive layouts and custom CSS.

The storefront cart is held in React state. Adding an item does not reserve or reduce database inventory, and refreshing the page clears the cart.

### Backend capabilities

- Account creation through `POST /signup` (no React signup screen yet).
- Password hashing with bcrypt and parameterized SQL queries.
- PostgreSQL-backed sessions, regenerated on login and account creation.
- Server-side authorization for admin routes.
- Database-backed cart endpoints, not yet connected to the React cart.
- Database constraints for unique usernames, nonnegative stock and prices, and one review per user per product.

## Architecture

```text
React client (TypeScript, React Router, Bootstrap)
    |
    | fetch requests through the Vite development proxy
    v
Express routes and middleware
    |
    v
Controllers → services / models → PostgreSQL
    |
    +-- express-session → connect-pg-simple → session table
```

The client manages navigation and UI state. Express handles authentication, authorization, validation, and data access through the `pg` connection pool. Backend code is JavaScript; the client uses TypeScript components and type definitions. Controllers use a mixture of services, models, and direct SQL queries.

The database contains `users`, `products`, `cart`, and `reviews`, plus the session store's `session` table. Cart rows belong to a user and product; reviews associate users with products.

```text
client/
  src/
    products/       Product listing, details, and admin editing
    cart/           In-memory storefront cart
    login/          Login form
    reviews/        Review display and submission
    layout/         Shared navigation, header, and footer
server/
  routes/           HTTP route definitions
  controllers/      Request handlers
  services/         Application logic
  models/           Database queries
  middleware/       Authorization and validation responses
  validators/       Input validation rules
  db/               Schema, sample products, and migrations
  lib/              Environment configuration and database pool
  tests/            Jest tests
  public/           Product images
```

## Technologies

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript components, React Router, Vite |
| Styling | Bootstrap, custom CSS |
| Backend | Node.js, Express, JavaScript (CommonJS) |
| Database | PostgreSQL, `pg` |
| Authentication | bcrypt, express-session, connect-pg-simple |
| Validation | express-validator, client-side form checks |
| Testing | Jest, PostgreSQL-backed tests, mocked controller dependencies |

React renders the storefront; Express serves JSON endpoints and static product images.

## Local setup

### 1. Prerequisites and installation

Use Node.js **22.12 or newer**, npm, and a running PostgreSQL installation with the `psql` and `createdb` commands available. The PostgreSQL role you use must be able to create the development database and its tables.

The Node 16 engine declaration in `server/package.json` is outdated relative to the installed Vite version, which requires Node `^20.19.0 || >=22.12.0`.

```bash
git clone https://github.com/Developer-Dave1/ecommerce_store.git
cd ecommerce_store
npm ci --prefix server
npm ci --prefix client
cp server/.env.example server/.env
```

If you already have the repository locally, run the installation commands from its root.

### 2. Configure the server

Edit `server/.env` for your PostgreSQL connection. Use a separate development database so it is distinct from the database targeted by the existing tests:

```dotenv
NODE_ENV=development
PORT=3000
HOST=localhost
PGHOST=localhost
PGPORT=5432
PGDATABASE=ecommerce_dev
# Set these if your local PostgreSQL connection requires them:
# PGUSER=your_postgres_role
# PGPASSWORD=your_postgres_password
# SECRET=replace_with_a_long_random_value
```

Without `PGUSER` or `PGPASSWORD`, the driver uses local connection defaults. Without `SECRET`, development uses a temporary random secret and existing sessions become invalid after a server restart. A secret is required when `NODE_ENV=production`.

The example file defaults to `ecommerce_test`; change it to `ecommerce_dev` for this walkthrough. The commands below use PostgreSQL CLI connection defaults; supply `-h localhost -U your_postgres_role` if your local authentication requires them. `psql` does not automatically read `server/.env`.

### 3. Create the database and load sample products

Run these commands from the repository root against a **new, empty database**:

```bash
createdb ecommerce_dev
psql -v ON_ERROR_STOP=1 -d ecommerce_dev -f server/db/schema.sql
psql -v ON_ERROR_STOP=1 -d ecommerce_dev -f server/node_modules/connect-pg-simple/table.sql
psql -v ON_ERROR_STOP=1 -d ecommerce_dev -f server/db/seed.sql
```

The session-table command is required: `schema.sql` does not create that table, and the server is not configured to create it automatically. The seed adds nine sample products, including an out-of-stock item. It does not create any users. Schema and seed scripts are intended to run once on a fresh database.

The fresh schema already includes `users.is_admin`; the migration in `server/db/migrations/` is for an existing database missing that field.

### 4. Start the backend and create an account

In one terminal:

```bash
cd server
npm start
```

The backend listens on port `3000` by default. In another terminal, create a local demo account directly through the API:

```bash
curl -i http://localhost:3000/signup \
  -H 'Content-Type: application/json' \
  --data '{"username":"demo","password":"DemoPassword123"}'
```

Expect a `201` response for a new username. Use these credentials in the React login form. The account is a regular user by default.

To try admin editing, promote this local demo account, then log out and log in again so the session picks up the role:

```bash
psql -d ecommerce_dev -c "UPDATE users SET is_admin = TRUE WHERE username = 'demo';"
```

### 5. Start the frontend

From the repository root in a separate terminal:

```bash
cd client
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`, and log in. Keep both servers running. Vite proxies `/login`, `/logout`, `/products`, `/admin`, and `/images` to `http://localhost:3000`. Signup is called directly on the backend because `/signup` is not included in the proxy configuration.

If you change the backend port, update the proxy targets in `client/vite.config.js` as well.

## Testing and development commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `client/` | `npm run dev` | Start the Vite development server |
| `client/` | `npm run build` | Bundle the client for production |
| `client/` | `npm run preview` | Preview the client bundle locally |
| `client/` | `npm run lint` | Run the existing ESLint configuration |
| `server/` | `npm start` | Start Express |
| `server/` | `npx --no-install jest --runInBand` | Run the existing backend tests sequentially |

Jest tests cover product, user, and cart database operations, service behavior, and selected controller behavior. Several suites connect directly to a database named **`ecommerce_test`** and truncate tables with `CASCADE`. Use only a disposable database with that name; changing `PGDATABASE` in `.env` does not redirect those hardcoded connections. Run suites sequentially because they share database tables.

To prepare a fresh disposable test database, from the repository root:

```bash
createdb ecommerce_test
psql -v ON_ERROR_STOP=1 -d ecommerce_test -f server/db/schema.sql
psql -v ON_ERROR_STOP=1 -d ecommerce_test -f server/node_modules/connect-pg-simple/table.sql
cd server
npx --no-install jest --runInBand
```

**Current test limitations:** some controller tests still expect Pug rendering rather than JSON responses, and product test helpers omit fields required by the current schema. The suite needs updating; a passing suite and coverage percentage have not been verified. No frontend or end-to-end test suite is configured.

The client build does not run TypeScript type checking, and the current ESLint configuration targets JavaScript/JSX files rather than TypeScript/TSX files.

## Known limitations and next steps

- **Persistent cart integration:** connect the React cart to the existing backend endpoints. Cart state currently resets on refresh and is not explicitly cleared on logout.
- **Authentication UI:** add registration and restore the current user's session when the client loads. Currently, a refresh returns the UI to the login screen even if the server session remains valid.
- **Product endpoints:** finish the category and individual-product API handlers, which currently set a success status without sending a response. The React detail page uses the already-loaded product list instead. Category filtering and pagination are not exposed in the storefront.
- **Testing and tooling:** update legacy tests for the current schema and JSON responses, isolate database tests, and configure TypeScript checking and linting.
- **Error handling:** improve review and product-loading error feedback. Unknown backend routes return a JSON 404 response.
- **Purchasing:** checkout, payments, order history, and order processing are not implemented.
- **Deployment:** production hosting of the client, API routing, and session-cookie behavior need configuration and verification. `npm run build` creates a client bundle; Express does not currently serve it.

This README describes the current code. The older READMEs inside `client/` and `server/` contain template or legacy instructions and may differ from this setup.
