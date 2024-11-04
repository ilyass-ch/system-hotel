import React from "react";
import { Button, Divider, Spin } from "antd";
import { SwapOutlined, HeartOutlined, ShakeOutlined, WifiOutlined } from "@ant-design/icons";
import Star from "../Star";
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const iconStyle = {
  color: "#18458b",
  fontSize: "20px",
  margin: "0 10px",
};

const contentStyle = {
  minHeight: "90vh",
  background: "#f9f9f9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const hotelCardStyle = {
  width: "270px",
  borderRadius: "10px",
  background: "#fff",
  margin: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const hotelImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderTopRightRadius: "10px",
  borderTopLeftRadius: "10px",
};

const hotelInfoStyle = {
  padding: "15px",
};

const buttonStyle = {
  backgroundColor: "#18458b",
  borderColor: "#18458b",
};

export default function RecentlyAddedHotels() {
  const [hotels, setHotels] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate(); // Hook pour la navigation

  React.useEffect(() => {
    axios
      .get("http://localhost:7000/api/hotel", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Vérifiez les données reçues
        const sortedHotels = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHotels(sortedHotels.slice(0, 4));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);

  const handleBookNowClick = () => {
    const token = Cookies.get('token');

  
    if (!token) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page d'inscription
      navigate("/login");
    } else {
      // Sinon, rediriger vers la page de réservation
      navigate("/booking");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={contentStyle}>
      <Star />
      <h1 style={{ color: "#18458b", marginBottom: "20px" }}>Recently Added Hotels</h1>
      <p style={{ textAlign: "center", maxWidth: "600px", color: "#555", lineHeight: "1.6" }}>
        Découvrez les derniers hôtels ajoutés à notre plateforme. Réservez dès maintenant pour profiter des meilleures offres.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            style={hotelCardStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <img
              style={hotelImageStyle}
              alt={hotel.name}
              src={hotel.imageUrl || "https://via.placeholder.com/300"}
            />
            <div style={hotelInfoStyle}>
              <h2 style={{ margin: "0 0 10px", color: "#18458b" }}>{hotel.name}</h2>
              <p style={{ color: "#777" }}>{hotel.description}</p>
        
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button type="primary" style={buttonStyle} onClick={handleBookNowClick}>
                  Book Now
                </Button>
                <div style={{ display: "flex" }}>
                  <SwapOutlined style={iconStyle} />
                  <HeartOutlined style={iconStyle} />
                  <ShakeOutlined style={iconStyle} />
                  <WifiOutlined style={iconStyle} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
