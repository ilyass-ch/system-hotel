import React, { useState, useEffect } from "react";
import { Button, Divider, Modal, Form, Input, Avatar, Card, Select, message, Upload } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import './styles.css'; // Assurez-vous que le fichier CSS est bien importé

const { Meta } = Card;
const { Option } = Select;

const ManageHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    console.log('Fetching hotels and cities');
    
    // Fetch hotels from the API
    axios.get("http://localhost:7000/api/hotel")
      .then((response) => {
        console.log('Fetched hotels:', response.data);
        setHotels(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the hotels!", error);
        message.error('Failed to load hotels.');
      });

    // Fetch cities from the API
    axios.get("http://localhost:7000/api/city", {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log('Fetched cities:', response.data);
      setCities(response.data);
    })
    .catch((error) => {
      console.error("There was an error fetching the cities!", error);
      message.error('Failed to load cities.');
    });
  }, []);

  const showModal = (hotel = null) => {
    console.log('Showing modal for:', hotel);
    setEditingHotel(hotel);
    if (hotel) {
      form.setFieldsValue({
        name: hotel.name || "",
        description: hotel.description || "",
        location: hotel.location || "",
        amenities: hotel.amenities || "",
        city: hotel.city?._id || "",
      });
      setImageUrl(hotel.imageUrl || "https://via.placeholder.com/300"); // Use default image if null
    } else {
      form.resetFields();
      setImageUrl('');
    }
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    setLoading(true);
    const token = Cookies.get('token');
    
    const imageUrlFull = imageUrl && !imageUrl.startsWith('http') 
      ? `http://localhost:7000/images/${imageUrl}` 
      : imageUrl;
  
    const hotelData = {
      ...values,
      imageUrl: imageUrlFull,
    };
  
    if (editingHotel) {
      axios.put(`http://localhost:7000/api/hotel/${editingHotel._id}`, hotelData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      })
        .then(() => {
          setHotels(hotels.map(h => h._id === editingHotel._id ? { ...h, ...hotelData } : h));
          setEditingHotel(null);
          setIsModalVisible(false);
          message.success('Hotel mis à jour avec succès!');
        })
        .catch((error) => {
          message.error('Échec de la mise à jour de l\'hôtel.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios.post("http://localhost:7000/api/hotel", hotelData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      })
        .then((response) => {
          setHotels([...hotels, response.data]);
          setIsModalVisible(false);
          message.success('Hôtel créé avec succès!');
        })
        .catch((error) => {
          message.error('Échec de la création de l\'hôtel.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  const handleImageUpload = async ({ file }) => {
    console.log('Uploading image:', file);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('imageUrl', file);
  
      const token = Cookies.get('token');
  
      const response = await axios.post(
        'http://localhost:7000/api/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.data.imageUrl) {
        const fullImageUrl = `${response.data.imageUrl}`;
        console.log('Uploaded image URL:', fullImageUrl);
        setImageUrl(fullImageUrl);
      } else {
        console.error('Image URL not found in response');
      }
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      message.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (hotelId) => {
    console.log('Deleting hotel with ID:', hotelId);
    axios.delete(`http://localhost:7000/api/hotel/${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      withCredentials: true,
    })
      .then(() => {
        console.log('Hotel deleted successfully.');
        setHotels(hotels.filter(h => h._id !== hotelId));
        message.success('Hotel deleted successfully!');
      })
      .catch((error) => {
        console.error("There was an error deleting the hotel!", error);
        message.error('Failed to delete hotel.');
      });
  };

  return (
    <div style={{ padding: 50 }}>
      <Button type="primary" icon={<PlusOutlined />} 
      onClick={() => showModal(null)}
      style={{ marginBottom: 16 , width:220, display: 'flex', justifyContent: 'center', marginBottom: 16, marginLeft:1200  }}
      
      >
        Add Hotel
      </Button>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {hotels.map((hotel) => (
          <Card
            key={hotel._id}
            style={{ width: 300, marginBottom: 20 }}
            cover={
              <img 
                alt={hotel.name} 
                src={hotel.imageUrl || "https://via.placeholder.com/300"} 
                className="image-size" // Appliquer la classe CSS
              />
            }
            actions={[
              <EditOutlined key="edit" onClick={() => showModal(hotel)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(hotel._id)} />,
            ]}
          >
            <Meta 
              avatar={<Avatar src={hotel.imageUrl || "https://via.placeholder.com/300"} />} 
              title={hotel.name} 
              description={hotel.description} 
            />
          </Card>
        ))}
      </div>

      <Modal
        title={editingHotel ? "Edit Hotel" : "Add Hotel"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={editingHotel || { name: "", description: "", location: "", amenities: "", city: "" }}
          onFinish={handleOk}
        >
          <Form.Item name="name" label="Hotel Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amenities" label="Amenities">
            <Input />
          </Form.Item>
          <Form.Item name="photos" label="Photos">
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {imageUrl && 
              <img 
                src={imageUrl} 
                alt="Uploaded Image" 
                className="image-size" // Appliquer la classe CSS
                style={{ marginTop: 10 }}
              />
            }
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Select placeholder="Select a city">
              {cities.map(city => (
                <Option key={city._id} value={city._id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingHotel ? "Update Hotel" : "Add Hotel"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageHotel;
