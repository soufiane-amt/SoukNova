# SoukNova 🏡✨

**SoukNova** is a modern e-commerce platform dedicated to selling house decorations. It provides a seamless shopping experience with a responsive front-end and a robust backend architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Screenshots & Demo](#screenshots--demo)
5. [Installation & Setup](#installation--setup)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Database Structure](#database-structure)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

SoukNova is designed to offer an intuitive online marketplace for home decoration enthusiasts. Users can browse products, add them to their cart, and purchase them securely. The platform ensures:

* Smooth and interactive frontend experience.
* Strong type safety with TypeScript and Zod validation.
* Scalable backend with NestJS and Prisma ORM.
* Persistent data storage using PostgreSQL.

---

## Features

* **User Authentication:** Sign up, login, and authentication system based on JWT.
* **Product Catalog:** Browse decorative items by categories.
* **Shopping Cart:** Add, remove, and update products.
* **Order Management:** Place and track orders.
* **Account Management:** Choose your profile picture and manage your account info.
* **Blog Catalog:** Browse different articals items that discuss different decoration topics.
* **Responsive Design:** Works across mobile, tablet, and desktop devices.

---

## Tech Stack

**Frontend:**

* [Next.js](https://nextjs.org/) – React framework
* [React](https://reactjs.org/) – UI library
* [Tailwind CSS](https://tailwindcss.com/) – Styling
* [Zod](https://zod.dev/) – Validation

**Backend:**

* [NestJS](https://nestjs.com/) – Node.js framework
* [Prisma](https://www.prisma.io/) – ORM for PostgreSQL
* [PostgreSQL](https://www.postgresql.org/) – Relational database
* [TypeScript](https://www.typescriptlang.org/) – Language

**Other Tools:**

* [Docker](https://www.docker.com/) – Containerization

---

## Screenshots & Demo

**Homepage:**

![Homepage Screenshot](path/to/homepage.png)

**Product Page:**

![Product Page Screenshot](path/to/product.png)

**Shopping Cart:**

![Cart Screenshot](path/to/cart.png)

**Demo Video:**

[![SoukNova Demo](https://youtu.be/cv4Tq6BzPLY)](https://youtu.be/cv4Tq6BzPLY)

> Tip: You can record your screen using tools like [OBS Studio](https://obsproject.com/) and upload to GitHub or YouTube for embedding.

---

## Installation & Setup (Using Docker Compose)

### Prerequisites

* [Docker](https://www.docker.com/) installed
* [Docker Compose](https://docs.docker.com/compose/) installed

---

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/SoukNova.git
cd SoukNova
```

2. **Create environment files** (There are default .env files just for testing)

For the backend (`backend/.env`):

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/souknova"
JWT_SECRET="your_jwt_secret"
PORT=3001
```

For the frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Start the application**

```bash
docker-compose up --build
```

* Backend: `http://localhost:3001`
* Frontend: `http://localhost:3000`
* PostgreSQL: `localhost:5432`

> Docker Compose will automatically build images, start the database, and run both backend and frontend.

4. **Stop the application**

```bash
docker-compose down
```

---

This way, anyone can run your entire app with **a single command** (`docker-compose up --build`) and you don’t need users to install Node.js or PostgreSQL locally.

## Usage

* Create account
* Browse products.
* Add items to the cart.
* Proceed to checkout and place an order.

---

## API Endpoints

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/auth/signup`    | Register a user     |
| POST   | `/auth/signin`    | Login a user        |
| GET    | `/shop`           | Get all products    |
| GET    | `/product/:id`    | Get product details |
| POST   | `/orders`         | Create a new order  |
| GET    | `/orders/:userId` | Get user orders     |


Do you want me to do that next?
