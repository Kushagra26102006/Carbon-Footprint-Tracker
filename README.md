# EcoTrack – Carbon Footprint Tracker 🌿

EcoTrack is a full-stack MERN application designed to help users calculate, monitor, and reduce their daily carbon footprint. By logging daily activities such as transport commute patterns, dietary choices, energy bills, and waste recycling, users get an immediate calculation of their environmental impact and receive tailored green recommendation strategies powered by AI.

---

## 🚀 Key Features

### Basic (MVP)
- **JWT Authentication**: Secure user registration and login with encrypted passwords (`bcryptjs`).
- **Interactive Daily Logger**: Quick tab-based logging forms for Transport, Diet, Utilities, and Waste.
- **Carbon Math Engine**: Automated translation of mileage, meals, energy, and trash into $CO_2$ equivalents ($CO_2e$) using standard IPCC coefficients.
- **Emissions Dashboard**: At-a-glance weekly carbon metrics and logging summaries.

### Intermediate
- **Historical Reports**: Dynamic visual analytics (Bar Charts & Pie Charts) using Recharts.
- **Target Goal Budgets**: Ability to set a monthly budget limit with visual warnings when thresholds are crossed.
- **Gamified Badge Unlocks**: Automated unlocking of achievements based on sustainable logging habits (e.g. "Green Commuter", "Plant-Based Hero").

### Advanced
- **AI Recommendation Engine**: Contextual recommendations generated from weekly activity logs using Google Gemini AI, with a rule-based fallback if the API is offline.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), React Router DOM v6, Axios, Recharts, Lucide Icons, Vanilla CSS Design system.
- **Backend**: Node.js, Express.js, Mongoose ODM, Zod Validator schemas.
- **Database**: MongoDB Atlas (NoSQL Document Cloud Storage).
- **Authentication**: JWT (JSON Web Tokens) with custom Bearer token checks.

---

## 📂 Project Structure

```text
ecotrack/
├── backend/                  # Node.js & Express.js REST API
│   ├── config/               # Database connection configurations
│   ├── controllers/          # Business logic handlers (MVC Controllers)
│   ├── middleware/           # Session guards & error interceptors
│   ├── models/               # Mongoose DB schemas (MVC Models)
│   ├── routes/               # API endpoints declarations (MVC Routes)
│   ├── utils/                # Emission factors & calculations
│   └── validators/           # Zod schema checks
│
└── frontend/                 # React.js SPA (Vite)
    ├── src/
    │   ├── components/       # Shared layout components (Navbar, Auth Guards)
    │   ├── context/          # Auth Context providers (State Management)
    │   ├── pages/            # Core views (Dashboard, Analytics, Profile)
    │   └── index.css         # Styling system
```

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Community Server (running locally) or a MongoDB Atlas account

### 1. Database & Environment Setup
Navigate to the `backend` folder:
```bash
cd backend
```
Create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecotrack
JWT_SECRET=choose_a_long_secret_signing_key_for_jwt
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_ai_studio_api_key_here
```

### 2. Start the Backend API
Install dependencies and run the backend server:
```bash
npm install
npm run dev
```
The server will boot in development mode on **`http://localhost:5000`**.

### 3. Start the Frontend React Client
Open a new terminal window and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend build will start on **`http://localhost:3000`**, automatically proxying API calls to port 5000.

---

## 🧪 Testing

### API Testing via Postman
A preconfigured collection file is included at:
`backend/EcoTrack_Backend_Test.postman_collection.json`
1. Open Postman, click **Import**, and load the JSON file.
2. Trigger the **User Registration** or **User Login** request to authenticate.
3. The response token is automatically saved as a collection variable (`authToken`) and attached to subsequent headers.

---

## 🌐 Production Deployment Summary

- **Database**: MongoDB Atlas (Free Tier cluster)
- **Backend API**: Render or Railway (deploying `/backend` directory, configuring server variables)
- **Frontend App**: Vercel or Netlify (deploying `/frontend` directory, specifying port 3000 proxy parameters)

For step-by-step instructions on deploying the project and configuring environment variables, refer to our [Deployment and Placement Presentation Guide](file:///Users/kushagra/.gemini/antigravity-ide/brain/696edfd0-e634-47d7-9e9a-d4a955068179/ecotrack_deployment_and_presentation_guide.md).
