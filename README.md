# IntelliCampus — Backend

This is the **backend server** for the **IntelliCampus** project — a smart campus management system designed to support features like attendance, student data, and administrative APIs.  
Built with **Node.js** and following a clean and scalable REST API architecture, this backend serves as the foundation for powering the IntelliCampus frontend and other integrations.

---

## Overview

IntelliCampus backend provides:

- User authentication and role-based access
- Database models for students, staff, attendance, and more
- REST APIs to power frontend features
- Secure and scalable application structure

This backend is intended to work alongside the IntelliCampus frontend app to build a full-stack campus management system.

---

## Tech Stack

| Technology      | Purpose                        |
|-----------------|-------------------------------|
| Node.js         | Runtime environment           |
| Express         | Web framework                 |
| MongoDB         | Database                      |
| Mongoose        | MongoDB object modeling       |
| JWT             | Authentication & sessions     |
| bcrypt          | Password hashing              |
| dotenv          | Environment variable config   |

---

## Getting Started

Follow these steps to run this backend server locally:

### 1. Clone the Repository

```bash
git clone https://github.com/akhil-k9/intelliCampus-Backend.git
cd intelliCampus-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your own.

### 4. Start the Server

```bash
npm run dev
```

Server will start and begin listening for API requests on your configured port.

---

## API Endpoints

API : https://intellicampus-backend-u8b8.onrender.com

### Authentication

- `POST /api/auth/register` — Register a new user  
- `POST /api/auth/login` — Login user and issue JWT

### Students

- `GET /api/students` — List all students  
- `POST /api/students` — Add a student  
- `GET /api/students/:id` — Get student details  
- `PUT /api/students/:id` — Update student  
- `DELETE /api/students/:id` — Remove student


---

## Folder Structure

```
intelliCampus-Backend/
├── controllers/         # Route logic controllers
├── models/              # Mongoose models
├── routes/              # Express route definitions
├── middlewares/         # Auth and other middleware
├── utils/               # Helpers and utilities
├── .env                 # Environment variables
├── server.js            # App entry point
├── package.json
└── README.md
```

---

## Available Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start backend server in development  |
| `npm start`     | Run the backend in production        |


---

## Contributing

Contributions and improvements are welcome!  
Please submit issues or pull requests for any enhancements or fixes.

---

## Author

Akhil — building scalable backend systems for modern applications.
