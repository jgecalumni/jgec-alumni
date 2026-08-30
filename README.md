# JGEC Alumni Association Platform

Welcome to the **JGEC Alumni Association** platform repository. This project consists of a main public-facing frontend, an admin dashboard, and a robust Node.js backend. The entire stack is containerized using Docker for seamless local development and production deployment.

## 🏗️ Architecture & Services

The platform is a monolithic repository containing three primary services:

1. **Jgec-Alumni-Frontend**: The main public website for alumni, built with **Next.js**, Tailwind CSS, and shadcn/ui.
2. **Jgec-alumni-admin**: The administrative dashboard for managing alumni data, built with **Next.js**.
3. **Jgec_Alumni_Backend**: The core API server, built with **Node.js, Express, and Prisma** (ORM).
4. **Database & Cache**: Relies on a **MySQL** database and a **Redis** instance for caching.

---

## 📁 File Structure

```text
jgec-alumni/
├── Jgec-Alumni-Frontend/      # Next.js Public Frontend
│   ├── src/                   # Source code (pages, components, styles)
│   ├── public/                # Static assets
│   ├── next.config.mjs        # Next.js configuration
│   └── tailwind.config.ts     # Tailwind CSS configuration
├── Jgec-alumni-admin/         # Next.js Admin Dashboard
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   └── next.config.mjs        # Next.js configuration
├── Jgec_Alumni_Backend/       # Node.js/Express API Backend
│   ├── prisma/                # Prisma schema and migrations
│   ├── src/controller/        # API Controllers
│   ├── src/router/            # API Routes
│   ├── src/middleware/        # Custom middlewares
│   └── index.ts               # Application entry point
├── docker-compose.yml         # Docker Compose for Local Development
├── docker-compose.prod.yml    # Docker Compose for Production
├── .env                       # Environment Variables (Secrets)
└── README.md                  # Project Documentation
```

---

## ⚙️ Environment Variables (`.env`)

You need a `.env` file at the root of the project. Below is the list of required variables. **Do not commit actual secrets to version control.**

```env
# Database Configuration
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<db_name>"

# Authentication
JWT_SECRET="your_jwt_secret_key"

# CORS & URLs
FORNTEND_URI_DEV="http://localhost:4000"
FORNTEND_URI_PROD="https://admin.jgecalumni.in"
FORNTEND_URI_MAIN="https://jgecalumni.in"
FORNTEND_URI_MAIN_TWO="https://www.jgecalumni.in"
FORNTEND_URI_ADMIN_DEV="http://localhost:3000"

# Email Configuration (Nodemailer)
EMAIL_USERNAME="your_email@gmail.com"
EMAIL_PASSWORD="your_app_password"
MONEY_EMAIL="receipt_email@gmail.com"
MONEY_PASSWORD="receipt_app_password"

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Initial Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin_password"

# Google Sheets / Service Account (Frontend envs)
CLIENT_EMAIL="service-account@..."
CLIENT_ID="your_client_id"
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID="your_spreadsheet_id"

# Application URLs & Configs
NEXT_PUBLIC_API_URL="/v1/api"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
INTERNAL_BACKEND_URL="http://backend:8000"
REDIS_URL="redis://redis:6379"
GENERATE_SOURCEMAP="false"
GITHUB_REPOSITORY_LOWER="jgecalumni/jgec-alumni"
```

*(Note: The Next.js apps receive `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKEND_URL` as build arguments via Docker Compose.)*

---

## 🚀 How to Run (Local Development)

The easiest way to run the entire stack locally is using **Docker Compose**.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Make sure ports `3000`, `4000`, `8000`, and `6379` are free on your local machine.

### Steps
1. **Clone the repository** and navigate to the project root:
   ```bash
   cd jgec-alumni
   ```
2. **Create the `.env` file** in the root directory and fill it with your development values (as shown above).
3. **Start the containers** using the local Docker Compose file:
   ```bash
   docker-compose -f docker-compose.yml up --build
   ```
4. **Access the Applications**:
   - **Frontend**: http://localhost:4000
   - **Admin Dashboard**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **Redis**: localhost:6379

---

## 🌍 How to Run (Production)

For production, the deployment uses `docker-compose.prod.yml`, which pulls pre-built Docker images from GitHub Container Registry (GHCR) instead of building them from source on the server.

### Steps
1. **Server Setup**: Ensure Docker and Docker Compose are installed on your production server.
2. **Transfer Files**: Copy the `docker-compose.prod.yml` and your production `.env` file to the server.
3. **Authenticate with GHCR** (if images are private):
   ```bash
   echo $CR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   ```
4. **Start the Services**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
5. **Reverse Proxy & SSL**: It is highly recommended to put an NGINX reverse proxy in front of ports `3000`, `4000`, and `8000` to handle SSL (HTTPS) termination.

---

## 🛠️ Manual Setup (Without Docker)

If you prefer to run services individually without Docker:

1. **Backend**:
   ```bash
   cd Jgec_Alumni_Backend
   npm install # or pnpm install / yarn install
   npx prisma generate
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd Jgec-Alumni-Frontend
   npm install
   npm run dev
   ```
3. **Admin**:
   ```bash
   cd Jgec-alumni-admin
   npm install
   npm run dev
   ```
*(Note: You will also need to have a Redis instance and MySQL database running locally and update your `.env` accordingly).*
