import React, { Component } from "react";
import axios from "axios";
import { Carousel, Form, Input, Button, DatePicker, AutoComplete } from "antd";
import { UsergroupDeleteOutlined, SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default class Banner extends Component {
  constructor() {
    super();
    this.state = {
      cities: [],
      hotels: [],
      cityOptions: [],
      hotelOptions: [],
      form: "",
      carouselImages: [
        "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",  // Spa de luxe
        "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",  // Bar élégant
        "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",  // Restaurant chic
        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",  // Réception d'hôtel luxueuse
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",  // Chambre de luxe
        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg"
      ], // Ajouter des images ici
    };
  }

  componentDidMount() {
    this.fetchCities();
  }

  fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/city");
      const cities = response.data;
      const cityOptions = cities.map((city) => ({
        value: city.name,
        id: city._id,
      }));
      this.setState({ cities, cityOptions });
    } catch (error) {
      console.error("There was an error fetching the cities!", error);
    }
  };

  handleCitySelect = async (value, option) => {
    let hotels;
    try {
      const response = await axios.get("http://localhost:7000/api/hotel");
      hotels = response.data;
    } catch (error) {
      console.error("There was an error fetching the hotels!", error);
    }

    let cityHotels = hotels.filter(
      (hotel) => hotel.city && hotel.city._id === option.id
    );
    const hotelOptions = cityHotels.map((hotel) => ({
      value: hotel.name,
    }));
    this.setState({ hotelOptions });
  };

  onFinish = (values) => {
    console.log("Finish:", values);
  };

  render() {
    const { cityOptions, hotelOptions, form, carouselImages } = this.state;

    return (
      <div style={{ position: "relative" }}>
        {/* Contenu fixe : Titre et formulaire de recherche */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10, // Assure que le contenu fixe reste au-dessus du carousel
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "570px", // Même hauteur que le carousel
            color: "#fff",
            background: "rgba(0, 0, 0, 0.4)", // Ajoute un effet de transparence
          }}
        >
          <h1 style={{ color: "#fff", fontSize: 40 }}>
            EasyBook Hotel Booking System
          </h1>
          <p>Let's start exploring the world together with EasyBook</p>

          <div
  style={{
    background: "rgba(255, 255, 255, 0.4)",  // Blanc avec 40% d'opacité
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  }}
>
  <Form
    form={form}
    name="horizontal_login"
    layout="inline"
    size="large"
    onFinish={this.onFinish}
  >
    <Form.Item
      name="city"
      rules={[
        {
          required: true,
          message: "Please select your city!",
        },
      ]}
    >
      <AutoComplete
        options={cityOptions}
        placeholder="City..."
        style={{ width: 200 }}
        onSelect={this.handleCitySelect}
        filterOption={(inputValue, option) =>
          option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
      />
    </Form.Item>

    <Form.Item
      name="hotel"
      rules={[
        {
          required: true,
          message: "Please select your hotel!",
        },
      ]}
    >
      <AutoComplete
        options={hotelOptions}
        placeholder="Hotel..."
        style={{ width: 200 }}
        filterOption={(inputValue, option) =>
          option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
      />
    </Form.Item>

    <Form.Item
      name="when"
      rules={[
        { required: true, message: "Please input when to when!" },
      ]}
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      name="persons"
      rules={[
        {
          required: true,
          message: "Please input your adults number",
        },
      ]}
    >
      <Input
        prefix={
          <UsergroupDeleteOutlined className="site-form-item-icon" />
        }
        type="text"
        placeholder="Persons"
      />
    </Form.Item>

    <Form.Item shouldUpdate>
      {() => (
        <Button
          style={{
            background: "rgba(255, 295, 355, 0.4)",  // Blanc avec 40% d'opacité
            color: "#000",
            borderRadius: '10px',
          }}
          htmlType="submit"
        >
          Search <SearchOutlined />
        </Button>
      )}
    </Form.Item>
  </Form>
</div>

        </div>

        {/* Carousel avec les images */}
        <Carousel autoplay autoplaySpeed={3000} dots={false} speed={2000}>
  {carouselImages.map((image, index) => (
    <div key={index}>
      <div
        style={{
          height: "570px",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  ))}
</Carousel>

      </div>
    );
  }
}
