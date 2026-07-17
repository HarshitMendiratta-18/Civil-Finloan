# Civil Finloan Application

This project is a pixel-perfect recreation of the Civil Finloan Application from the course screenshots, built with React (Vite) and Node.js (Express) deployed as Vercel Serverless Functions.

## Features
- **Clean Responsive Navbar & Footer**: Responsive teal design with dynamic dropdowns.
- **Interactive Home & About Us**: Matching description and button navigation.
- **Service details page**: Displays loan requirements (Minimum/Maximum amounts, Tenure) dynamically based on the selected service code.
- **EMI Calculator**: Accurately estimates daily EMI payouts based on the custom daily interest formula: `P * R * T * 2 / 365`. Includes min/max amount validation and tenure validation.
- **Authentication system**: Register as a member and login to update personal profile details. Saves sessions locally in the browser (`localStorage`).
- **Fully Vercel compatible**: Configured to run on Vercel serverless functions out of the box.

---

## File Structure
```
├── api/
│   └── index.js             # Express API Serverless backend for Vercel
├── public/
│   ├── sprouts_banner.png   # Home page banner generated asset
│   └── favicon.svg
├── src/
│   ├── auth/
│   │   └── AuthProvider.jsx # Global Auth state context with local persistence
│   ├── components/
│   │   ├── FlexBetween.jsx  # Flex helper layout component
│   │   ├── NavBar.jsx       # Header navigation bar
│   │   └── Footer.jsx       # Footer component
│   ├── pages/
│   │   ├── HomePage.jsx     # Home view
│   │   ├── AboutUs.jsx      # Info page & route redirect
│   │   ├── ServicePage.jsx  # Service specific detail renderer
│   │   ├── EmiCalculator.jsx# EMI Calculator form and checks
│   │   ├── JoinAsMember.jsx # Sign Up view
│   │   ├── LoginPage.jsx    # Login view
│   │   └── Profile.jsx      # Profile settings updater
│   ├── App.jsx              # Main router and API loader
│   ├── main.jsx             # React entrypoint
│   └── index.css            # Custom premium vanilla stylesheet
├── data.json                # Seed database
├── server.js                # Local Express server runner (Port 7070)
├── vite.config.js           # Vite configurations (alias & proxy)
└── vercel.json              # Vercel deployment route handler
```

---

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Project 3"
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running Locally
To run both the **React Frontend** (on `http://localhost:5173`) and the **Express Backend** (on `http://localhost:7070`) concurrently, run:
```bash
npm start
```

### Vercel Deployment
To deploy to Vercel, simply deploy via Vercel CLI:
```bash
vercel
```
This will automatically compile the Vite frontend bundle and serve the serverless functions under `/api/v1/*` route seamlessly.
