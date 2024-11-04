import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const HotelDetails = () => {
  const { hotelId } = useParams(); // Get hotelId from the route parameters
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hotel details and rooms from the API
    axios.get(`http://localhost:7000/api/hotel/${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token is sent
      }
    })
    .then((response) => {
      setHotel(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('There was an error fetching the hotel details!', error);
      setLoading(false);
    });
  }, [hotelId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!hotel) {
    return <p>No hotel found.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>{hotel.name}</Title>
      <img
        alt={hotel.name}
        src={hotel.photos[0] || 'default-image-url'}
        style={{ width: '100%', height: 'auto' }}
      />
      <p>Location: {hotel.location}</p>
      <p>Price: ${hotel.price}</p>
      <p>Rating: {hotel.rating}</p>

      <Title level={3}>Rooms</Title>
      {hotel.rooms && Array.isArray(hotel.rooms) && hotel.rooms.length > 0 ? (
        <Row gutter={16}>
          {hotel.rooms.map(room => (
            <Col span={8} key={room._id} style={{ marginBottom: 20 }}>
              <Card
                hoverable
                cover={<img alt={`Room ${room.number}`} src={room.photos[0] || 'default-room-image-url'} />}
              >
                <Card.Meta
                  title={`Room ${room.number}`}
                  description={`Type: ${room.type}`}
                />
                <p>Price: ${room.price}</p>
                <p>Availability: {room.availability ? 'Available' : 'Not Available'}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default HotelDetails;
