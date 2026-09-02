# Punjab Dairy Farm — Backend

A Node.js/Express backend for your dairy farm website. It serves your existing
frontend (`public/index.html`, `style.css`, `script.js`, `images/`) and adds
real APIs so orders, animal inquiries, and contact messages are actually saved
instead of just showing an `alert()`.

## What was added

- **Database**: a plain JSON file (`data/dairyfarm.json`) — no database server,
  and no native modules to compile. Pure JavaScript, works identically on
  Windows/Mac/Linux with just `npm install`.
- **Data stored**: `products`, `animals`, `orders` (with items), `animal_inquiries`,
  `contact_messages` — auto-created and seeded with your existing products/animals
  on first run.
- **API routes**: see below.
- **`script.js` changes**: `submitOrder`, `submitAnimalInquiry`, and
  `submitContact` now `fetch()` the backend instead of only showing an alert.
  Everything else in your frontend (cart, UI, styling) is untouched.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set a real `ADMIN_KEY` (any secret string you choose) — this
protects the admin endpoints that list orders/inquiries/messages.

## Run

```bash
npm start
```

Visit **http://localhost:3000** — your website loads exactly as before, but
placing an order, sending an animal inquiry, or submitting the contact form
now saves to the database.

For development with auto-restart on file changes:

```bash
npm run dev
```

## API Reference

### Public endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/products`            | List all products                    |
| GET    | `/api/animals`             | List all animals                     |
| GET    | `/api/animals?type=cow`    | Filter animals (`cow` or `buffalo`)  |
| POST   | `/api/orders`               | Place an order                       |
| POST   | `/api/animal-inquiries`    | Submit an animal inquiry             |
| POST   | `/api/contact`              | Submit a contact message             |

### Admin endpoints (require the admin key)

Pass your key as `?key=YOUR_ADMIN_KEY` in the URL, or as an
`x-admin-key: YOUR_ADMIN_KEY` header.

| Method | Endpoint                          | Description                     |
|--------|-------------------------------------|-----------------------------------|
| GET    | `/api/orders?key=...`              | List all orders + items          |
| PATCH  | `/api/orders/:id/status?key=...`   | Update order status              |
| GET    | `/api/animal-inquiries?key=...`   | List all animal inquiries        |
| GET    | `/api/contact?key=...`             | List all contact messages        |

Example — view all orders in your browser:

```
http://localhost:3000/api/orders?key=your-admin-key-here
```

Example — mark an order as confirmed:

```bash
curl -X PATCH "http://localhost:3000/api/orders/1/status?key=your-admin-key-here" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

Valid statuses: `PENDING`, `CONFIRMED`, `DELIVERED`, `CANCELLED`.

## Project structure

```
backend/
  server.js              # Express app entry point
  db.js                  # SQLite schema + seed data
  middleware/
    adminAuth.js          # Simple key-based admin protection
  routes/
    products.js
    animals.js
    orders.js
    inquiries.js
    contact.js
  public/                # Your frontend, served as static files
    index.html
    style.css
    script.js
    images/
  data/                  # dairyfarm.json database file lives here (auto-created)
  .env.example
  package.json
```

## Notes & next steps

- **No login system** is included (customers or admin) — this keeps things
  simple, matching a straightforward informational + order-taking site. If
  you later want a real admin dashboard with login, or customer accounts to
  track order history, that can be added on top of this.
- **Admin key** is a lightweight protection, good for personal/small projects.
  If you deploy this publicly and want stronger security, swap it for
  session- or JWT-based authentication.
- **Why a JSON file instead of a "real" database?** It avoids native modules
  that need a C++ compiler (a common source of setup pain on Windows). It's
  perfectly fine for a small site's order volume. If you later expect heavy
  traffic, move to MongoDB or PostgreSQL — only `db.js` needs to change, since
  every route calls simple functions like `db.getOrders()` rather than raw
  queries.
- **Deploying**: any Node host works (Render, Railway, a VPS, etc.). Just make
  sure the `data/` folder is writable and persists between deploys — some
  hosts wipe the filesystem on redeploy, in which case move to a real
  database for production use.
