# Essentials backend endpoint reference

Reviewed against the local source on October 5, 2026.

## Scope and conventions

This documents the implemented backend, not a proposed React API. The server currently renders Pug HTML pages and processes form submissions. There is no `/api` prefix and no JSON response contract.

- Default local base URL: `http://localhost:3000` (override with `PORT`).
- Send POST fields as `application/x-www-form-urlencoded`. `app.js` does not currently install `express.json()`.
- Successful page renders normally return `200`. Redirects use `302` unless stated otherwise.
- Error responses are text messages or Express error pages, not structured JSON.
- Unknown routes return a `404` HTML page.
- IDs in examples are illustrative; use IDs present in your database.

## Authentication and sessions

Login and signup store `user_id` and `username` in a server-side session. Sessions are stored in PostgreSQL's `session` table. The browser sends the default `connect.sid` cookie on subsequent requests; no bearer token is returned.

The cookie is HTTP-only, SameSite=Lax, has a configured one-hour maximum age, and is secure in production. Without an explicit `SECRET`, local development generates a new secret at startup, invalidating previous cookies after a restart.

All `/products` and `/cart` routes require `req.session.username`. Missing login causes a `302` redirect to `/login` with an error flash message. **Management routes currently require login only; there is no administrator role check.**

## Login, signup, and logout

These routes have no login middleware.

| Method | Path | Input | Success | Other outcomes |
| --- | --- | --- | --- | --- |
| POST | `/login` | Body: `username`, `password` | Regenerates and saves session; `200` JSON success message | `401` invalid credentials; `500` login failure; shared validation behaviour below |
| POST | `/signup` | Body: `username`, `password` | Creates user with bcrypt-hashed password, regenerates and saves session; `201` JSON success message | `400` existing username; `500` creation/session failure; shared validation behaviour below |
| POST | `/logout` | None | Destroys session, clears cookie; `200` JSON success message | `500` logout failure |

Both credential fields are required. Current validators trim and HTML-escape both fields, including passwords. No minimum password length is implemented in those validators. The database restricts usernames to 50 characters and makes them unique.

Invalid login credentials return `Invalid username or password.` Existing signup usernames return `This username already exists.` Logout uses POST. Authentication errors are returned as JSON with an `error` field. Validation failures return `400` JSON with `error` and `errors` fields.

## Product browsing

All routes below require login.

| Method | Path | Input | Success | Other outcomes |
| --- | --- | --- | --- | --- |
| GET | `/products` | Optional query: `page`, default 1 | `allProducts` HTML with products and pagination | Invalid page: `302` to `/products?page=1`; database/render failure: `500` |
| GET | `/products/category/:product_type` | Path: category string; optional query: `page` | `categoryPages` HTML with matching products | Invalid page: `302` to the category URL with `?page=1`; failure: `500` |
| GET | `/products/item/:product_id` | Path: product ID | `singleProduct` HTML with product and reviews | Missing product: `404` with `Product not found.`; failure: `500` |

Lists are ordered by `product_name` ascending and contain **three products per page**. There is no configurable page size, search, or sorting endpoint. Category matching uses exact equality against `product_type`. An empty result is treated as one page.

Page numbers and product IDs are parsed with `parseInt`; strict whole-string numeric validation is not implemented. For example, a numeric prefix can be accepted. Malformed product IDs may produce `500` instead of `400`.

Template data (not JSON responses):

- Product list: `products`, `currentPage`, `totalPages`, `username`.
- Category list: the same plus `productType`.
- Product detail: `product`, `username`, `reviews`.

Product database fields: `id`, `product_name`, `price`, `quantity`, `image_url`, `product_type`, `description`. These differ from the React mock fields such as `name` and `image`.

## Reviews

Both routes require login.

### POST `/products/item/:product_id/review`

Form body:

| Field | Required | Behaviour |
| --- | --- | --- |
| `product_id` | Yes | Parsed as an integer; used as the target product |
| `comment` | Yes | Trimmed, required to be non-empty, HTML-escaped |

**The controller uses the body's `product_id`, not the path parameter.** Send matching IDs. The author ID and username come from the session.

Success inserts a review, adds a success flash message, and redirects to `/products/item/<body product_id>`. Validation failures use the shared handler described below. Database failures propagate to Express's error handler. There is no explicit missing-product `404` check before insertion; the database foreign key can reject an invalid target.

### POST `/products/item/:product_id/review/delete`

No body fields are required. The controller uses the path product ID and session user ID. It deletes **all reviews belonging to that user for that product**, not an individual review ID.

Success renders the updated `singleProduct` page (`200`), rather than redirecting. Missing user ID or an unparseable product ID redirects to `/products`. Caught failures redirect to the product detail URL. A success message can be shown even when no matching review existed.

## Cart

All cart routes require login. The controller currently falls back to user ID `1` if the session lacks `user_id`; clients should never rely on this fallback.

### GET `/cart`

No request fields. Intended response: `cart` HTML with `items` and a `total` formatted to two decimal places. Items include cart row fields plus product name and price.

**Known implementation issue:** the total reducer names its parameter `it2em` but refers to `item`. A non-empty cart therefore enters the error path and returns `500` with `Failed to load all items in cart.` An empty cart avoids that reducer callback.

### POST `/cart/add`

| Field | Required | Meaning |
| --- | --- | --- |
| `product_id` | Yes | Existing positive product ID |
| `quantity` | Yes | Positive quantity to add, no greater than available stock |

Fields are read from the form body, with query parameters accepted as a fallback. Values are parsed using `parseInt`.

Success adds to an existing cart row or creates one, reduces product stock, sets a success flash message, and redirects to `/cart`. Validation and caught service failures also redirect to `/cart`, with error flash messages. A `302` alone does not establish success.

The stock lookup occurs before ID validation and before the controller's try/catch. Missing products or invalid IDs can therefore cause an unhandled controller error and `500`, rather than the intended validation redirect.

### POST `/cart/remove`

Body: `product_id`. Removes the user's entire cart row for that product and restores that row's quantity to stock; it does not subtract just one unit.

Success redirects to `/cart`. If the product exists but is not in the user's cart, the service returns without deleting anything and the controller still redirects with a success message. Caught failures return `500` with `Failed to remove item from cart.`

Cart and stock writes are not wrapped in a transaction. Concurrent requests or a failure between writes can leave them inconsistent.

## Product management

All routes require login, but **any signed-in user can currently perform these operations**.

For this table, `:id` abbreviates the implemented parameter name `:product_id`.

| Method | Path | Form body | Success | Validation/error behaviour |
| --- | --- | --- | --- | --- |
| POST | `/admin` | `product_id` | Deletes product; `302` to `/admin` | Missing product/service errors propagate to Express |
| POST | `/admin/:id/changequantity` | `quantity` | Updates inventory; `302` to that management detail page | Positive ID; parsed quantity 0–100. Invalid ID redirects to management list; invalid quantity to detail; caught errors to list |
| POST | `/admin/:id/changename` | `new_name` | Renames product; `302` to detail | Controller requires positive ID and name length 1–50. Invalid name redirects to detail; invalid ID/caught errors to list |
| POST | `/admin/:id/changedescription` | `description` | Updates description; `302` to detail | Validator specifies 1–500 characters, but validation results are not checked; database errors before try/catch propagate |
| POST | `/admin/:id/changeprice` | `reqPrice` | Updates price; `302` to detail | Uses `parseFloat`, accepts values greater than 0 and at most 100, then rounds to two decimals. Invalid input redirects to detail; caught errors propagate |

Additional details:

- The name validator declares a 1–100 character limit, but its errors are not consumed on this route. The controller's 1–50 limit is the effective application check.
- Name and description validators trim and HTML-escape the input before the controller runs.
- The price message says the minimum is 0.01, but the actual check allows smaller positive numbers, which may round to zero.
- Deleting a product also deletes its associated cart rows and reviews through database `ON DELETE CASCADE` constraints.
- There is no registered product-creation route, despite a creation function existing in the service layer.

## Shared validation and errors

Login, signup, and review creation run `handleValidationErrors`. Invalid requests return `400` JSON with an `error` message and an `errors` array of validation messages.

There is no central JSON error middleware. Some controllers send explicit `500` text; others throw and rely on Express's default error handling. Flash messages and redirects are part of the current browser form workflow and are not a structured API success/error contract.

## Manual request examples

Run these in a shell, not at the PostgreSQL prompt. Start the server first. Replace the placeholder credentials with an existing account. Avoid putting real passwords into shared command logs or shell history.

Log in and save the session cookie locally:

```bash
curl -i -c /tmp/essentials-cookies.txt \
  --data-urlencode 'username=YOUR_USERNAME' \
  --data-urlencode 'password=YOUR_PASSWORD' \
  http://localhost:3000/login
```

Read products using that session:

```bash
curl -i -b /tmp/essentials-cookies.txt \
  'http://localhost:3000/products?page=1'
```

Read a product:

```bash
curl -i -b /tmp/essentials-cookies.txt \
  http://localhost:3000/products/item/1
```

The following changes the cart and available stock:

```bash
curl -i -b /tmp/essentials-cookies.txt \
  --data-urlencode 'product_id=1' \
  --data-urlencode 'quantity=1' \
  http://localhost:3000/cart/add
```

These examples intentionally do not use `-L`, so you can inspect the original redirect status and `Location` header. Responses are HTML or redirects; do not parse them as JSON.

## React integration: work still required

This section describes future work, not existing endpoints.

1. Add JSON endpoints under a clear prefix such as `/api`, and install JSON body parsing for those requests.
2. Keep database and business logic in the existing model/service layers; return data and status codes from API controllers instead of rendering Pug or redirecting.
3. Return an explicit authentication failure for API requests instead of an HTML login redirect.
4. Configure the Vite development proxy and session-cookie handling.
5. Map backend product fields to the frontend contract. Decide whether to return `product_name`/`image_url` or `name`/`image` consistently.
6. Fix the cart total bug, add management authorization, and make cart/stock changes transactional before treating the backend as deployment-ready.

No checkout, payment, orders, account-profile, or cart-quantity-update HTTP endpoint is currently registered. A cart quantity service function exists but is not exposed through a route.

## Source and verification

Derived from `app.js`, `routes/*.js`, `controllers/*.js`, `middleware/middleware.js`, `validators/validators.js`, the cart service, review model, and `db/schema.sql`. Paths in this section are relative to `server/`.

This is a source-based reference. Endpoint requests were not executed for this documentation task, and no application behaviour or database data was changed.
