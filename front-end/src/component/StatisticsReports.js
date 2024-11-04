import React, { useState, useEffect, useContext } from 'react'; 
import { Card, Col, Row, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserContext from './UserContext'; 
import { useNavigate } from 'react-router-dom';

const StatisticsReports = () => {
  const { user } = useContext(UserContext);
  const [reservationData, setReservationData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.role === 'admin') {
        setHasAccess(true);
        try {
          const token = Cookies.get('token');
          const [reservationsResponse] = await Promise.all([
            axios.get('http://localhost:7000/api/reservation', {
              headers: { 'Authorization': `Bearer ${token}` },
              withCredentials: true
            })
          ]);

          const reservations = reservationsResponse.data;

          // Calcul des données pour chaque graphique
          const reservationByMonth = calculateReservationsByMonth(reservations);
          const reservationByRoomType = calculateReservationsByRoomType(reservations);

          setReservationData(reservationByMonth);
          setRoomTypeData(reservationByRoomType);
        } catch (error) {
          console.error('There was an error fetching the data!', error);
        } finally {
          setLoading(false);
        }
      } else {
        message.error('Vous n\'avez pas accès à cette page.');
        navigate('/unauthorized');
      }
    };

    fetchData();
  }, [user, navigate]);

  // Fonctions pour calculer les tendances et répartitions
  const calculateReservationsByMonth = (reservations) => {
    const monthlyData = {};
    reservations.forEach(reservation => {
      const month = new Date(reservation.checkInDate).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  };

  const calculateReservationsByRoomType = (reservations) => {
    const typeData = {};
    reservations.forEach(reservation => {
      const type = reservation.room.type;
      if (type) {
        typeData[type] = (typeData[type] || 0) + 1;
      }
    });
    return Object.entries(typeData).map(([type, count]) => ({ type, count }));
  };

  const getRoomTypeColor = (type) => {
    switch(type) {
      case 'Chambre': return '#2474be'; 
      case 'Suite': return '#2434be'; 
      default: return '#8884d8'; 
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Tendances de Réservation par Mois">
            <LineChart width={600} height={300} data={reservationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#be2432" />
            </LineChart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Répartition des Réservations par Type de Chambre">
            <PieChart width={600} height={300}>
              <Pie
                data={roomTypeData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {roomTypeData.map((entry) => (
                  <Cell key={entry.type} fill={getRoomTypeColor(entry.type)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsReports;
