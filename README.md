Micro-CRM — Multi-Tenant Contact & Member Management
A lightweight CRM system built with Node.js, Express, MongoDB, and React, supporting:

Multi-tenancy
Role-based access control (Admin & Member)

Contact management
Member (User) management

■ Features
Multi-Tenancy
Each organization has isolated:
Users (Admin, Member)
Contacts
Role-Based Access Control

Admin → manage contacts + members
Member → view-only access
Contact Fields
Name
Email
Phone (optional)
Notes (optional)

Tech Stack
Node.js / Express
React / Vite
MongoDB / Mongoose
JWT Auth
Bcrypt hashing
Axios + Context API

■ Installation
Clone Repository
git clone https://github.com/abin223804/micro-crm.git
cd micro-crm
■■ Backend Setup
cd backend
npm install
Create .env file
MONGODB_URI=mongodb://localhost:27017/microcrm
JWT_SECRET=secret
JWT_EXPIRES_IN=7d
PORT=4000
Seed DB
npm run seed
Run Backend
npm run dev

■■ Frontend Setup
cd frontend
npm install
npm run dev
■ Multi-Tenancy Approach
Each User + Contact has:
organizationId
JWT contains:
{
"_id": "...",
"role": "admin",
"organizationId": "..."
}


All queries filtered by:
Contact.find({ organizationId: req.user.organizationId })
■ Auth Approach
JWT-based login:
Email + password validated
JWT includes: _id, role, org
Frontend stores token + role + orgName
■■ Tradeoffs
JWT vs Sessions
Simpler & scalable
Token invalidation requires refresh logic
Single-database Multi-Tenancy
Fast & simple
Shared DB vs per-tenant DB isolation
React Context vs Redux
Lightweight & ideal for auth
Not ideal for very large apps
Single Admin per Org
Simplifies management
Easily extendable later
■ Default Test Accounts
Admins
adminA@example.com / Password123!
adminB@example.com / Password123!
Members
memberA@example.com / Member123!
memberB@example.com / Member123!
