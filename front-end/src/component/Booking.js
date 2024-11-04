import React, { useState, useEffect } from 'react';
import { Spin, Button, message, Divider, DatePicker } from 'antd';
import { SwapOutlined, HeartOutlined, ShakeOutlined, WifiOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import PaymentModal from './PaymentModal'; // Importer le composant de paiement

const { RangePicker } = DatePicker;

const Booking = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // État pour stocker le montant total

  useEffect(() => {
    axios
      .get('http://localhost:7000/api/hotel', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the hotels!', error);
        setLoading(false);
      });
  }, []);

  const handleHotelClick = (hotelId) => {
    setLoading(true);
    axios
      .get(`http://localhost:7000/api/room/hotel/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setRooms(response.data);
        setSelectedHotel(hotelId);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the rooms!', error);
        setLoading(false);
      });
  };

  const calculateTotalAmount = (checkInDate, checkOutDate, roomPrice) => {
    const start = moment(checkInDate);
    const end = moment(checkOutDate);
    const numberOfDays = end.diff(start, 'days');
    return numberOfDays * roomPrice;
  };

  const handleReserve = (roomId) => {
    const room = rooms.find(room => room._id === roomId); // Recherchez la chambre par son ID
    if (!dates || dates.length !== 2) {
      message.error('Please select check-in and check-out dates.');
      return;
    }

    setSelectedRoom(room); // Stocker la chambre sélectionnée avec ses informations
    const calculatedTotalAmount = calculateTotalAmount(dates[0], dates[1], room.price); // Calculer le montant total
    setTotalAmount(calculatedTotalAmount); // Mettre à jour l'état du montant total
    setPaymentVisible(true); // Afficher la modal de paiement
  };

  const handlePaymentSuccess = () => {
    if (!selectedRoom || !dates || dates.length !== 2) {
      message.error('Please select a room and check-in/check-out dates.');
      return;
    }

    axios
      .post(
        'http://localhost:7000/api/reservation',
        {
          room: selectedRoom._id, // Envoyer l'ID de la chambre
          checkInDate: moment(dates[0]).format('YYYY-MM-DD'),
          checkOutDate: moment(dates[1]).format('YYYY-MM-DD'),
          totalAmount: totalAmount, // Montant total calculé
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        message.success('Room reserved successfully!');
        setPaymentVisible(false); // Fermer la modal de paiement après le succès
      })
      .catch((error) => {
        console.error('Error reserving room:', error);
        message.error('Failed to reserve room.');
      });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: 20 }}>
      {!selectedHotel ? (
        <>
          <h1 style={{ color: '#18458b' }}>Our Hotels</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                style={{
                  width: '30%',
                  margin: 20,
                  padding: 20,
                  borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => handleHotelClick(hotel._id)}
              >
                <img src={hotel.imageUrl || 'https://via.placeholder.com/300'} alt={hotel.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <h2>{hotel.name}</h2>
                <p>{hotel.location}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 style={{ color: '#18458b' }}>Rooms in Selected Hotel</h1>
          <RangePicker
            onChange={(value) => setDates(value)}
            style={{ marginBottom: 20 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {rooms.map((room) => (
              <div key={room._id} style={{ width: '30%', margin: 20, padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <img src={room.photos[0] || 'https://via.placeholder.com/300'} alt={`Room ${room.number}`} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <h2>Room {room.number}</h2>
                <p>Type: {room.type}</p>
                <p>Price: {room.price}</p>
                <p>Availability: {room.availability ? 'Available' : 'Not Available'}</p>
                {room.availability && (
                  <Button type="primary" onClick={() => handleReserve(room._id)}>Reserve</Button>
                )}
              </div>
            ))}
          </div>
          <Button onClick={() => setSelectedHotel(null)} style={{ marginTop: 20 }}>Back to Hotels</Button>
        </>
      )}

      {/* Modal de paiement */}
      <PaymentModal
        visible={paymentVisible}
        onCancel={() => setPaymentVisible(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={totalAmount} // Passez le montant total ici
      />
    </div>
  );
};

export default Booking;
