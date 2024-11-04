import React, { Component } from "react";
import {
  CreditCardOutlined,
  GiftOutlined,
  CustomerServiceOutlined,
  UsergroupDeleteOutlined,
  LikeOutlined,
  HeartOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import Star from "../Star";

const data = [
  { id: 1, icon: CustomerServiceOutlined, title: "Best Service Guarantee" },
  { id: 2, icon: GiftOutlined, title: "Exclusive Gifts" },
  { id: 3, icon: CreditCardOutlined, title: "Get More From Your Card" },
];

const data_new = [
  { id: 1, icon: UsergroupDeleteOutlined, title: "New Visitors Every Week", numbers: 254 },
  { id: 2, icon: LikeOutlined, title: "Happy Customers Every Year", numbers: 12168 },
  { id: 3, icon: HeartOutlined, title: "Awards Won", numbers: 172 },
  { id: 4, icon: IdcardOutlined, title: "New Listings Every Week", numbers: 765 },
];

export default class WhyChoose extends Component {
  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px", backgroundColor: "#f9f9f9" }}>
        <Star />
        <h1 style={{ color: "#003a6c", marginBottom: "20px" }}>Why Choose Us</h1>
        <p style={{ textAlign: "center", maxWidth: "600px", color: "#555", lineHeight: "1.6" }}>
          Discover the benefits that make us the best choice for your needs. Exceptional service, exclusive offers, and more await you.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: "30px" }}>
          {data.map((item) => (
            <div key={item.id} style={{ width: "280px", height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", margin: "10px", backgroundColor: "#fff", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} 
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <item.icon style={{ fontSize: "60px", color: "#003a6c" }} />
              <h2 style={{ textAlign: "center", color: "#003a6c", marginTop: "10px" }}>{item.title}</h2>
              <p style={{ textAlign: "center", color: "#777", marginTop: "10px" }}>
                Proin dapibus nisl ornare diam varius tempus. Aenean a quam luctus, finibus tellus ut, convallis eros sollicitudin turpis.
              </p>
            </div>
          ))}
        </div>

        <Divider style={{ margin: "40px 0" }} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%", maxWidth: "1200px" }}>
          {data_new.map((item) => (
            <div key={item.id} style={{ width: "23%", height: "120px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", border: "1px solid #e0f2f1", borderRadius: "8px", backgroundColor: "#e0f2f1", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", margin: "10px" }}>
              <div>
                <h1 style={{ fontSize: "28px", color: "#003a6c", margin: "0" }}>{item.numbers}</h1>
                <p style={{ fontSize: "14px", color: "#555", margin: "0" }}>{item.title}</p>
              </div>
              <item.icon style={{ fontSize: "60px", color: "#003a6c" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
