import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './component/UserContext'; // Assurez-vous du bon chemin
import Header from './component/Header'; // Assurez-vous du bon chemin
import HomePage from './pages/HomePage'; // Assurez-vous du bon chemin
import LoginPage from './component/Login'; // Assurez-vous du bon chemin
import RegisterPage from './component/Register'; // Assurez-vous du bon chemin
import ManageHotel from './component/ManageHotel'; // Assurez-vous du bon chemin
import ManageCity from './component/manageCity'; // Assurez-vous du bon chemin
import ManageRoom from './component/manageRoom'; // Assurez-vous du bon chemin
import ManageUsers from './component/manageUsers'; // Assurez-vous du bon chemin
import Booking from './component/Booking'; // Assurez-vous du bon chemin
import HotelDetails from './component/HotelDetails';
import EditProfile from './component/EditProfile'; // Assurez-vous du bon chemin
import ReservationsForm from './component/ReservationForm';
import StatisticsReports from './component/StatisticsReports';
import ChatList from './component/ChatList';
import PaymentModal from './component/PaymentModal';
import AboutUs from './component/AboutUs';
const App = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/manageHotel' element={<ManageHotel />} />
          <Route path='/manageCity' element={<ManageCity />} />
          <Route path='/manageRoom' element={<ManageRoom/>} />
          <Route path='/manageUsers' element={<ManageUsers/>} />
          <Route path='/Booking' element={<Booking/>} />
          <Route path="/hotel/:hotelId" element={<HotelDetails />} />
          <Route path='/EditProfile' element={<EditProfile/>} />
          <Route path='/ReservationsForm' element={<ReservationsForm />} />
          <Route path='/StatisticsReports' element={<StatisticsReports />} />
          <Route path='/ChatList' element={<ChatList />} />
          <Route path='/PaymentModal' element={<PaymentModal />} />
          <Route path='/AboutUs' element={<AboutUs />} />
          {/* Ajoutez d'autres routes ici */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
