import { useAuthContext } from "auth/AuthProvider";
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import AboutUs from "pages/AboutUs";
import EmiCalculator from "pages/EmiCalculator";
import HomePage from "pages/HomePage";
import JoinAsMember from "pages/JoinAsMember";
import LoginPage from "pages/LoginPage";
import ServicePage from "pages/ServicePage";
import Profile from "pages/Profile";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const getAllServices = async () => {
  const serviceResponse = await fetch("/api/v1/services", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  if (serviceResponse.status === 200) {
    return await serviceResponse.json();
  }
  throw new Error("Failed to load services");
};

function App() {
  const { state, setServices } = useAuthContext();
  const isAuth = Boolean(state.token);

  useEffect(() => {
    getAllServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error(err);
        setServices([]);
      });
  }, [setServices]);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <main className="main-content">
          <Routes>
            {/* Home Routes */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* About Us Routes */}
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/aboutus" element={<Navigate to="/aboutUs" />} />
            
            {/* Services Routes */}
            <Route path="/service/:code" element={<ServicePage />} />
            
            {/* EMI Calculator Routes */}
            <Route path="/emiCalculator" element={<EmiCalculator />} />
            <Route path="/emicalculator" element={<Navigate to="/emiCalculator" />} />
            
            {/* Join as Member Route */}
            <Route path="/joinAsMember" element={isAuth ? <Navigate to="/profile" /> : <JoinAsMember />} />
            <Route path="/joinasmember" element={<Navigate to="/joinAsMember" />} />
            
            {/* Profile Route */}
            <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/update" element={<Navigate to="/profile" />} />

            {/* Login Route */}
            <Route path="/login" element={isAuth ? <Navigate to="/profile" /> : <LoginPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
