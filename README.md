# 🚗 Vehicle Rental System API

Project Name : Vehicle Rental System (A RESTful backend API for managing a vehicle rental system, built with Express.js, TypeScript, and PostgreSQL)

Live URL : https://vehicle-rental-system-blond.vercel.app/

🎯Feature :
A backend API for a vehicle rental management system that handles:

Vehicles - Manage vehicle inventory with availability tracking
Customers - Manage customer accounts and profiles
Bookings - Handle vehicle rentals, returns and cost calculation
Authentication - Secure role-based access control (Admin and Customer roles)


🛠️ Technology Stack

Node.js + TypeScript
Express.js (web framework)
PostgreSQL (database)
bcrypt (password hashing)
jsonwebtoken (JWT authentication)

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

2️⃣ Install Dependencies (npm install)

3️⃣ Environment Configuration
PORT=5000
CONNECTION_STR=postgresql://neondb_owner:npg_1TIElO6gwMmy@ep-autumn-dawn-ahwnqxnz-pooler.c-3.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require

4️⃣ Run the Project (Development)
bash : npm run dev
server will start at : http://localhost:5000
🚀 Usage

API Base URL: /api/v1

Auth Routes: /api/v1/auth

Users Routes: /api/v1/users

Vehicles Routes: /api/v1/vehicles

Bookings Routes: /api/v1/bookings


🧪 Database Initialization

Tables are automatically created on server startup using initDB()

PostgreSQL hosted on Neon (serverless)

📌 Notes

Make sure your Neon database allows external connections

Always load dotenv.config() before accessing process.env

Uses connection pooling via pg.Pool

👨‍💻 Author

Md Mehedi Hasan
Department of Computer Science & Engineering, CUET
