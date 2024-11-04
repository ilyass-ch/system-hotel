import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, Button, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Meta } = Card;

const YourBooking = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les réservations de l'utilisateur connecté
    axios.get('http://localhost:7000/api/reservation', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est envoyé
      }
    })
    .then((response) => {
      setReservations(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des réservations!', error);
      message.error('Impossible de récupérer les réservations.');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Vos Réservations</Title>
      <Row gutter={16}>
        {reservations.length > 0 ? (
          reservations.map(reservation => (
            <Col span={8} key={reservation._id} style={{ marginBottom: 20 }}>
              <Card
                hoverable
                cover={<img alt={`Room ${reservation.room.number}`} src={reservation.room.photos[0] || 'default-room-image-url'} />}
              >
                <Meta
                  title={`Chambre ${reservation.room.number}`}
                  description={`Hôtel: ${reservation.room.hotel.name}`}
                />
                <p>Check-In: {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                <p>Check-Out: {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                <p>Prix Total: ${reservation.totalAmount}</p>
              </Card>
            </Col>
          ))
        ) : (
          <p>Vous n'avez aucune réservation.</p>
        )}
      </Row>
    </div>
  );
};

export default YourBooking;
