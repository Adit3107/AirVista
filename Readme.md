# 🌿 AirVista

AirVista is a **full-stack MERN platform** inspired by Airbnb that allows users to discover and book unique accommodations.  
It provides property search with filters, secure CRUD functionality for listings, and a responsive UI for smooth browsing across devices.  

---

## 🚀 Features  
- 🔎 **Property Search** with filters (location, price, amenities).  
- 🏡 **Host Properties** – users can create, update, and manage their own listings.  
- 📅 **Book Listings** – users can explore and book available accommodations.  
- 👤 **User Authentication** (signup/login & secure sessions).  
- 📱 **Responsive Design** for mobile & desktop.  
- ⚡ **MERN Stack** performance and scalability.  

---

## 🛠 Tech Stack  
- **Frontend:** React, Tailwind CSS / CSS Modules (if used), Axios  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Others:** JWT Authentication, REST APIs  

---

## 📂 Project Structure  
```
AirVista/
│── backend/         # Express.js + MongoDB API  
│   ├── models/      # Mongoose schemas  
│   ├── routes/      # API routes  
│   ├── controllers/ # Business logic  
│   ├── index.js    # Main server file  
│  
│── frontend/        # React app  
│   ├── src/  
│   │   ├── components/   # Reusable UI components  
│   │   ├── pages/        # Pages (Home, Search, Listing, etc.)  
│   │   ├── App.jsx        # Root component  
│  
│── README.md  
```

---

## ⚙️ Installation & Setup  

### 1. Clone the repository  
```bash
git clone https://github.com/your-username/AirVista.git
cd AirVista
```

### 2. Setup Backend  
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend:  
```bash
npm run dev
```

### 3. Setup Frontend  
```bash
cd ../frontend
npm install
npm start
```

---


## 🤝 Contributing  
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.  

---

## 📜 License  
This project is licensed under the MIT License.  

---

✨ Built with ❤️ using the MERN stack  

