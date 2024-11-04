import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const ManageCity = () => {
  const [cities, setCities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  useEffect(() => {
    // Fetch cities from the API
    axios.get("http://localhost:7000/api/city", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });
  }, [token]);

  const showModal = (city = null) => {
    setEditingCity(city);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingCity) {
        // Update city
        await axios.put(`http://localhost:7000/api/city/${editingCity._id}`, values, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setCities(cities.map(c => c._id === editingCity._id ? { ...c, ...values } : c));
        message.success('City updated successfully!');
      } else {
        // Create city
        const response = await axios.post("http://localhost:7000/api/city", values, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log(response);  // Add this line to see the response
        setCities([...cities, response.data]);
        message.success('City created successfully!');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error(`There was an error ${editingCity ? 'updating' : 'creating'} the city!`, error.response ? error.response.data : error.message);
      message.error(`Erreur lors de ${editingCity ? 'la mise à jour' : 'la création'} de la ville.`);
    }
  };
  
  

  const handleDelete = async (cityId) => {
    try {
      await axios.delete(`http://localhost:7000/api/city/${cityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCities(cities.filter(c => c._id !== cityId));
    } catch (error) {
      console.error("There was an error deleting the city!", error);
    }
  };

  const columns = [
    {
      title: "City Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 50 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 , width:220, display: 'flex', justifyContent: 'center', marginBottom: 16, marginLeft:1200  }}

      >
        Add City
      </Button>
      <Table
        columns={columns}
        dataSource={cities}
        rowKey={(record) => record._id}
      />

      <Modal
        title={editingCity ? "Edit City" : "Add City"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingCity || { name: "", country: "" }}
          onFinish={handleOk}
        >
          <Form.Item name="name" label="City Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editingCity ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCity;
