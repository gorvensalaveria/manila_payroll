Manila Payroll - Master File CRUD Application

This is a full-stack CRUD application for managing employee and department records, following the requirements from the ManilaPayroll.com Master File feature.

Main Features:

* Add new employee and department records
* View, search, and sort records in tables
* Edit existing records
* Delete records with confirmation
* Input validation and user-friendly error messages
* Export employee data

Project Structure:
manila-payroll/
backend/      (Express + MySQL REST API)
frontend/     (React + PrimeReact web app)
README.md

Getting Started:

Backend Setup:

1. Go to the backend folder: cd backend
2. Copy .env.example to .env and set your MySQL details (DB\_HOST, DB\_USER, DB\_PASSWORD, DB\_NAME, PORT).
3. Install dependencies: npm install
4. Start the backend server: npm run dev
   The backend runs on [http://localhost:3000/](http://localhost:3000/)

Frontend Setup:

1. Go to the frontend folder: cd ../frontend
2. Copy .env.example to .env and set the backend API URL (REACT\_APP\_API\_URL=[http://localhost:3000/api](http://localhost:3000/api))
3. Install dependencies: npm install
4. Start the frontend app: npm start
   The frontend runs on [http://localhost:3001/](http://localhost:3001/) (or another available port)

Usage:

* Open the frontend app in your browser.
* Use the UI to add, view, edit, or delete employees and departments.
* The employee table is searchable and sortable.
* All changes are saved in the MySQL database.

Tech Stack:

* Frontend: React, PrimeReact, Axios
* Backend: Node.js, Express, MySQL

License: MIT

---

If you want it **even more plain** (as in literally just plain text), let me know.
Otherwise, this is perfectly readable on GitHub, and doesn’t use any Markdown formatting besides dashes for lists.
