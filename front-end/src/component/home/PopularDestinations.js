import React, { Component } from "react";
import Star from "../Star";
import { Card, Button } from "antd"; 
import "../styles.css"; 

import casaImage from "../images/Casablanca-.jpg";
import rabatImage from "../images/rabat.jpg";
import kechImage from "../images/Marrakech.jpg";
import tangerImage from "../images/Tanger.jpg";

const destinations = [
  {
    name: "Tanger",
    image: tangerImage ,
    description: "Explore the romantic city of Tanger.",
  },
  {
    name: "Marrakech",
    image: kechImage,
    description: "Discover the bustling streets of Marrakech.",
  },
  {
    name: "Casablanca",
    image: casaImage,
    description: "Experience the futuristic city of Casablanca.",
  },
  {
    name: "Rabat",
    image: rabatImage,
    description: "Enjoy the sunny beaches of Rabat.",
  },
];

export default class PopularDestinations extends Component {
  render() {
    return (
      <div style={{ padding: "40px 0", backgroundColor: "#f5f5f5" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          {/* Conteneur pour les étoiles */}
          <div className="stars-container">
            <Star />

          </div>
          <h1 style={{ color: "#18458b", fontSize: "3rem" }}>
            Popular Destinations
          </h1>
          <p style={{ color: "#555" }}>
            Discover the most visited places around the world!
          </p>
        </div>

        <div className="destinations-grid">
          {destinations.map((destination, index) => (
            <Card
              key={index}
              hoverable
              cover={
                <img
                  alt={destination.name}
                  src={destination.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ color: "#18458b" }}>{destination.name}</h2>
              <p>{destination.description}</p>
              <Button type="primary" style={{ backgroundColor: "#18458b" }}>
                Explore
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}
