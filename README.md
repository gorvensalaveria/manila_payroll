# Manila Payroll Master File – CRUD Application

A modern, full-stack **Employee & Department Management System** inspired by ManilaPayroll.com, built with:

* **Backend:** Node.js, Express, MySQL
* **Frontend:** React, PrimeReact

---

## Features

* Dashboard with analytics and recent employee records
* Employee Master Table with create, read, update, and delete (CRUD) functionality
* Department Management (CRUD)
* Search, sort, and filter options for both tables
* Responsive interface using PrimeReact components
* Input validation and user-friendly error messages
* Data export capability

---

## Screenshots

### Dashboard

![Dashboard](./assets/image.png)

### Employee Management

![Employee Management](./assets/image2.png)

### Department Management

![Department Management](./assets/image3.png)

---

## How to Run the Project

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs by default at [http://localhost:3001](http://localhost:3001).

> **Note:**
>
> * Make sure your MySQL server is running and credentials are set correctly in `backend/.env`.
> * The default API URL for the frontend is `REACT_APP_API_URL=http://localhost:3001/api` (configured in `frontend/.env`).

---

## Project Structure

```
Manila_Payroll/
  ├── backend/
  │   ├── routes/
  │   ├── src/
  │   ├── node_modules/
  │   └── ...
  └── frontend/
      ├── src/
      ├── node_modules/
      └── ...
```

---

## Credits & Author

* Developed by: [Gorven Salaveria](https://github.com/gorvensalaveria)
* Coding challenge for: Jimmy Dagum, Jimmyzel Software

---

## License

This project is for assessment and demonstration purposes only.
