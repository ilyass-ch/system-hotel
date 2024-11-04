import React, { Component } from "react";
import { Row, Col } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Link } from 'react-router-dom';


export default class Footer extends Component {
  render() {
    return (
      <footer
        style={{
          backgroundColor: "#18458b",
          color: "#fff",
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "'Roboto', sans-serif",
        }}>
        <Row justify='center' gutter={[16, 16]}>
          <Col span={6}>
            <h3
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                borderBottom: "2px solid #fff",
                paddingBottom: 10,
                marginBottom: 20,
                letterSpacing: "1px",
              }}>
              Our Company
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#about'
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 16,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#f39c12')}
                  onMouseLeave={(e) => (e.target.style.color = '#fff')}
                >
                  <Link to='/AboutUs' style={{ color: 'inherit' }}>
                    About Us
                  </Link>
                </a>
              </li>
              
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#services'
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 16,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#f39c12')}
                  onMouseLeave={(e) => (e.target.style.color = '#fff')}
                >
                  <Link to='/Services' style={{ color: 'inherit' }}>
                    Services
                  </Link>
                </a>
              </li>
  
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#careers'
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                  onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                  Careers
                </a>
              </li>
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#contact'
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                  onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>
          <Col span={6}>
            <h3
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                borderBottom: "2px solid #fff",
                paddingBottom: 10,
                marginBottom: 20,
                letterSpacing: "1px",
              }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#privacy'
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                  onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#terms'
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                  onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                  Terms of Service
                </a>
              </li>
              <li style={{ marginBottom: 10 }}>
                <a
                  href='#faq'
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                  onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                  FAQ
                </a>
              </li>
            </ul>
          </Col>
          <Col span={6}>
            <h3
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                borderBottom: "2px solid #fff",
                paddingBottom: 10,
                marginBottom: 20,
                letterSpacing: "1px",
              }}>
              Follow Us
            </h3>
            <div>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: "#fff",
                  marginRight: 10,
                  fontSize: 24,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                <FacebookOutlined />
              </a>
              <a
                href='https://www.twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: "#fff",
                  marginRight: 10,
                  fontSize: 24,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                <TwitterOutlined />
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: "#fff",
                  marginRight: 10,
                  fontSize: 24,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                <InstagramOutlined />
              </a>
              <a
                href='https://www.linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: "#fff",
                  fontSize: 24,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                onMouseLeave={(e) => (e.target.style.color = "#fff")}>
                <LinkedinOutlined />
              </a>
            </div>
          </Col>
        </Row>
        <Row justify='center' style={{ marginTop: 30 }}>
          <Col>
          <p style={{ textAlign: "center", marginTop: "40px", fontSize: "14px", color: "#999" }}>
              © 2024 RoyaleHotel. Tous droits réservés.
            </p>
          </Col>
        </Row>
      </footer>
    );
  }
}
