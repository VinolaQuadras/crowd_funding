
import './App.css';
import {BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import AdminApproved from './Pages/Admin/AdminApproved.tsx';
import CustomNavbar from './Pages/Common/CustomNavbar.tsx';
import Login from './Pages/Auth/Login.tsx';
import Signup from './Pages/Auth/Signup.tsx';
import ForgotPassword from './Pages/Auth/ForgotPassword.tsx';
import ResetPassword from './Pages/Auth/ResetPassword.tsx';
import Dashboard from './Pages/Common/Dashboard.tsx';
import Profile from './Pages/Auth/Profile.tsx';
import Startups from './Pages/Startups/Startups.tsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.tsx';
import MyStartups from './Pages/Startups/MyStartups.tsx';
import AdminRejected from './Pages/Admin/AdminRejected.tsx';
import AdminPending from './Pages/Admin/AdminPending.tsx';
import InvestPage from './Pages/Payments/InvestPage.tsx';
import MyInvestments from './Pages/Payments/MyInvestment.tsx';
import StartupFundingDetails from './Pages/Startups/StartupFundingDetails.tsx';
import PaymentSuccessPage from './Pages/Payments/PaymentSuccessPage.tsx';
import PaymentCancelPage from './Pages/Payments/PaymentCancelPage.tsx';



const AppContent: React.FC=()=> {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/register"];
  
  return (
    <>  
      {!hideNavbarPaths.includes(location.pathname) && <CustomNavbar />}
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/startups" element={<Startups />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />}/>
      <Route path="/your-campaigns" element={<MyStartups />}/>
      <Route path="/admin/approved" element={<AdminApproved />} />
      <Route path="/admin/rejected" element={<AdminRejected />} />
      <Route path="/admin/pending" element={<AdminPending />} />
      <Route path="/invest/:startupId" element={<InvestPage />} />
      <Route path="/your-investments" element={<MyInvestments />} />
      <Route path="/funding-details/:startupId" element={<StartupFundingDetails />} />
      <Route path="/success" element={<PaymentSuccessPage />} />
      <Route path="/cancel" element={<PaymentCancelPage />} />
      
      
    </Routes>
  </> 
  );
}
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App
