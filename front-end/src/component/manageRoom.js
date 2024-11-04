import React, { useState, useEffect } from "react";
import { Button, Divider, Modal, Form, Input, Card, Select, message, Upload } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import './styles.css'; // Assurez-vous que le fichier CSS est bien importé

const { Meta } = Card;
const { Option } = Select;

const ManageRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Fetch rooms from the API
    axios.get("http://localhost:7000/api/room")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        message.error('Failed to load rooms.');
      });

    // Fetch hotels from the API
    axios.get("http://localhost:7000/api/hotel", {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      withCredentials: true,
    })
    .then((response) => {
      setHotels(response.data);
    })
    .catch((error) => {
      message.error('Failed to load hotels.');
    });
  }, []);

  const showModal = (room = null) => {
    setEditingRoom(room);
    if (room) {
      form.setFieldsValue({
        number: room.number || "",
        type: room.type || "",
        price: room.price || "",
        availability: room.availability ? "available" : "unavailable",
        hotel: room.hotel?._id || "",
      });
      setPhotos(room.photos || []); // Récupérer les photos existantes
    } else {
      form.resetFields();
      setPhotos([]);
    }
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    setLoading(true);
    const token = Cookies.get('token');
    const availabilityBoolean = values.availability === "available";

    const roomData = {
      ...values,
      availability: availabilityBoolean,
      photos: photos.length > 0 ? photos : [], // Gérer les photos
    };

    if (editingRoom) {
      axios.put(`http://localhost:7000/api/room/${editingRoom._id}`, roomData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      })
        .then(() => {
          setRooms(rooms.map(r => r._id === editingRoom._id ? { ...r, ...roomData } : r));
          setEditingRoom(null);
          setIsModalVisible(false);
          message.success('Room updated successfully!');
        })
        .catch((error) => {
          message.error('Failed to update room.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios.post("http://localhost:7000/api/room", roomData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      })
        .then((response) => {
          setRooms([...rooms, response.data]);
          setIsModalVisible(false);
          message.success('Room created successfully!');
        })
        .catch((error) => {
          message.error('Failed to create room.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleImageUpload = async ({ file }) => {
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
        setPhotos([...photos, response.data.imageUrl]); // Ajouter la nouvelle photo à la liste des photos
        message.success('Image uploaded successfully!');
      } else {
        console.error('Image URL not found in response');
      }
    } catch (error) {
      message.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une photo
  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, photoIndex) => photoIndex !== index));
  };

  const handleDelete = (roomId) => {
    axios.delete(`http://localhost:7000/api/room/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      withCredentials: true,
    })
      .then(() => {
        setRooms(rooms.filter(r => r._id !== roomId));
        message.success('Room deleted successfully!');
      })
      .catch((error) => {
        message.error('Failed to delete room.');
      });
  };

  return (
    <div style={{ padding: 50 }}>
      <Button type="primary" icon={<PlusOutlined />}
      onClick={() => showModal(null)}
      style={{ marginBottom: 16 , width:220, display: 'flex', justifyContent: 'center', marginBottom: 16, marginLeft:1200  }}
       >
        Add Room
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
        {rooms.map((room) => (
          <Card
            key={room._id}
            style={{ width: 300, marginBottom: 20 }}
            cover={
              <img 
                alt={room.number} 
                src={room.photos.length > 0 ? room.photos[0] : "https://via.placeholder.com/300"} 
                className="image-size"
              />
            }
            actions={[
              <EditOutlined key="edit" onClick={() => showModal(room)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(room._id)} />,
            ]}
          >
            <Meta 
              title={`Room ${room.number}`} 
              description={`Type: ${room.type}, Price: ${room.price}`} 
            />
          </Card>
        ))}
      </div>

      <Modal
        title={editingRoom ? "Edit Room" : "Add Room"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={editingRoom || { number: "", type: "", price: "", availability: "", hotel: "" }}
          onFinish={handleOk}
        >
          <Form.Item name="number" label="Room Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Room Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="availability" label="Availability" rules={[{ required: true }]}>
            <Select>
              <Option value="available">Available</Option>
              <Option value="unavailable">Unavailable</Option>
            </Select>
          </Form.Item>
          <Form.Item name="imageUrl" label="Images">
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {photos.length > 0 && 
              <div className="uploaded-images">
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={photo} 
                      alt={`Room Photo ${index + 1}`} 
                      className="image-size"
                      style={{ marginTop: 10 }}
                    />
                    <CloseCircleOutlined 
                      onClick={() => handleRemovePhoto(index)} 
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        cursor: 'pointer',
                        color: 'red',
                        fontSize: '20px'
                      }}
                    />
                  </div>
                ))}
              </div>
            }
          </Form.Item>
          <Form.Item name="hotel" label="Hotel" rules={[{ required: true }]}>
            <Select>
              {hotels.map(hotel => (
                <Option key={hotel._id} value={hotel._id}>{hotel.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingRoom ? "Update Room" : "Add Room"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRoom;
