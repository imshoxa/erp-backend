# ERP Backend (Node.js + TypeScript + MongoDB)

Backend ERP system implementing inventory-driven business flows:
**Products → Purchase Receipts → Sales → Dashboard**

The project focuses on **correct ERP behavior**, not just CRUD:
- document lifecycle
- inventory integrity
- auditability
- reporting via database aggregation

---

## 🚀 Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **MongoDB + Mongoose**
- **Jest + Supertest**
- **mongodb-memory-server** (for tests)

---

## 🧠 ERP Principles Implemented

- **Confirmed documents are immutable**
- **Inventory changes only through documents**
- **No negative stock allowed**
- **No hard deletes for operational documents**
- **Full auditability via document lifecycle**

---

## 📦 Modules Overview

### Products
- Supports tracking types: `SIMPLE`, `VARIANT`, `SERIAL`, `LOT`, `EXPIRABLE`
- Variant parent products are not stockable or sellable
- Tracking type is immutable after usage
- Soft delete supported

### Inventory Core
- Centralized inventory logic
- `increaseStock`, `decreaseStock`, `checkAvailability`
- Single source of truth for stock
- Handles real ERP edge cases (multiple stock records, aggregation)

### Purchase Receipts
- Lifecycle: `DRAFT → CONFIRMED → CANCELLED`
- Stock increases only on CONFIRM
- Cancellation fully reverts inventory
- Immutable confirmed documents

### Sales
- Lifecycle: `DRAFT → CONFIRMED → CANCELLED`
- Stock availability enforced before confirmation
- Stock decreases on CONFIRM
- Cancellation restores stock correctly

### Dashboard (Reporting)
- Read-only APIs
- Uses MongoDB aggregation pipelines
- Only CONFIRMED documents affect reports
- Includes:
  - Sales summary
  - Daily sales
  - Top products
  - Inventory summary
  - Purchase summary

---

## 🧪 Tests

Critical ERP business rules are covered:

- Purchase confirmation increases stock
- Sale confirmation without stock is blocked
- Sale confirmation decreases stock
- Sale cancellation restores stock

Tests use **in-memory MongoDB** and run sequentially to ensure stability.

```bash
npm test

▶️ Running the Project
npm install
npm run dev

🤖 Note on AI Assistance
This project was developed with the help of AI-assisted guidance (for example, code suggestions and structural recommendations).

However:
all logic decisions,
debugging,
fixing edge cases,
adapting ERP rules,
and final implementation
were understood, validated, and manually integrated by the developer.

The goal was not blind copy-paste, but learning and applying real-world backend and ERP concepts.

📌 Purpose
This project was built as a learning and evaluation task to demonstrate:

backend architecture skills
understanding of ERP systems
ability to work with business rules
testing of critical logic

📎 Author

Shohruh (GitHub: imshoxa)
Junior Backend Developer (Node.js / TypeScript)
