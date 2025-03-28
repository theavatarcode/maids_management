# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Database Schema

### Customers
| Column     | Type         | Constraints                |
|------------|--------------|---------------------------|
| id         | INT          | PRIMARY KEY, AUTO_INCREMENT|
| name       | VARCHAR(100) | NOT NULL                  |
| email      | VARCHAR(100) | NOT NULL, UNIQUE          |
| phone      | VARCHAR(20)  | NOT NULL                  |
| address    | TEXT         | NOT NULL                  |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Maids
| Column        | Type         | Constraints                |
|---------------|--------------|---------------------------|
| id            | INT          | PRIMARY KEY, AUTO_INCREMENT|
| name          | VARCHAR(100) | NOT NULL                  |
| email         | VARCHAR(100) | NOT NULL, UNIQUE          |
| phone         | VARCHAR(20)  | NOT NULL                  |
| status        | ENUM         | ('available','busy','offline')|
| service_areas | JSON         | NOT NULL                  |
| rating        | DECIMAL(2,1) | DEFAULT 0                 |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Bookings
| Column      | Type         | Constraints                |
|-------------|--------------|---------------------------|
| id          | INT          | PRIMARY KEY, AUTO_INCREMENT|
| customer_id | INT          | FOREIGN KEY (customers.id) |
| maid_id     | INT          | FOREIGN KEY (maids.id)     |
| date        | DATE         | NOT NULL                  |
| time        | TIME         | NOT NULL                  |
| status      | ENUM         | ('pending','confirmed','completed','cancelled')|
| price       | DECIMAL(10,2)| NOT NULL                  |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Payments
| Column         | Type         | Constraints                |
|----------------|--------------|---------------------------|
| id             | INT          | PRIMARY KEY, AUTO_INCREMENT|
| booking_id     | INT          | FOREIGN KEY (bookings.id)  |
| amount         | DECIMAL(10,2)| NOT NULL                  |
| payment_method | ENUM         | ('credit_card','bank_transfer','cash')|
| status         | ENUM         | ('pending','completed','failed')|
| created_at     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Reviews
| Column      | Type         | Constraints                |
|-------------|--------------|---------------------------|
| id          | INT          | PRIMARY KEY, AUTO_INCREMENT|
| booking_id  | INT          | FOREIGN KEY (bookings.id)  |
| customer_id | INT          | FOREIGN KEY (customers.id) |
| maid_id     | INT          | FOREIGN KEY (maids.id)     |
| rating      | INT          | NOT NULL, CHECK (rating BETWEEN 1 AND 5)|
| comment     | TEXT         | NULL                      |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Foreign Key Relationships
- `bookings.customer_id` -> `customers.id`
- `bookings.maid_id` -> `maids.id`
- `payments.booking_id` -> `bookings.id`
- `reviews.booking_id` -> `bookings.id`
- `reviews.customer_id` -> `customers.id`
- `reviews.maid_id` -> `maids.id`

### Indexes
- `customers`: email (UNIQUE)
- `maids`: email (UNIQUE)
- `bookings`: customer_id, maid_id
- `payments`: booking_id
- `reviews`: booking_id, customer_id, maid_id

### Triggers
1. After INSERT on `reviews`:
   - Update `maids.rating` with average rating

2. After DELETE on `reviews`:
   - Update `maids.rating` with new average rating

   

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
