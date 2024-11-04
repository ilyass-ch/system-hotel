import React from "react";
import { Row, Col, Card, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#f4f4f4", padding: "50px 20px" }}>
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: "40px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}>
            <Title level={2} style={{ textAlign: "center", color: "#18458b" }}>
              Bienvenue chez RoyaleHotel
            </Title>

            <Divider />

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              <strong>RoyaleHotel</strong> propose une solution moderne de gestion hôtelière
              qui simplifie les processus de réservation, les paiements et la gestion des opérations.
              Grâce à notre plateforme, vous pouvez accéder à une gamme diversifiée d'options d'hébergement, 
              allant des hôtels indépendants aux grandes chaînes internationales.
            </Paragraph>

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              Notre mission est de vous offrir une expérience fluide en centralisant toutes les informations
              nécessaires sur une seule plateforme. Vous pouvez consulter les tarifs, vérifier la disponibilité
              des chambres, et découvrir tous les services et équipements disponibles dans les établissements que nous référençons.
            </Paragraph>

            <Title level={3} style={{ marginTop: "30px", color: "#18458b" }}>
              Services Offerts
            </Title>

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              - Réservations instantanées et sécurisées pour tous types d'hébergements.
            </Paragraph>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              - Accès à une large gamme d'hôtels, d'appartements et d'appart'hôtels dans le monde entier.
            </Paragraph>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              - Comparaison des prix, des services et des équipements sur une seule plateforme.
            </Paragraph>

            <Title level={3} style={{ marginTop: "30px", color: "#18458b" }}>
              À Propos de RoyaleHotel
            </Title>

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
              <strong>RoyaleHotel</strong> est une filiale de RoyaleGroup, leader dans l'industrie de l'hôtellerie.
              Notre siège social est situé au 123 Avenue Royale, Rabat  Avec une expertise étendue dans le secteur,
              nous nous engageons à fournir une plateforme fiable et innovante pour la gestion d'hôtels à travers le monde.
            </Paragraph>

            <Divider />

            <Paragraph style={{ textAlign: "center", marginTop: "40px", fontSize: "14px", color: "#999" }}>
              © 2024 RoyaleHotel. Tous droits réservés.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
