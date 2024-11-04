import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, Avatar, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(editingUser?.profilePicture || '');
  const token = Cookies.get('token');

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    axios.get('http://localhost:7000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    .then((response) => setUsers(response.data))
    .catch((error) => message.error('Erreur lors de la récupération des utilisateurs.'));
  }, [token]);

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user && user.profilePicture) {
      setFileList([{
        uid: uuidv4(),
        name: 'profile.png',
        status: 'done',
        url: user.profilePicture,
      }]);
    } else {
      setFileList([]);
    }
  };

const handleOk = async (values) => {
  setLoading(true);

  let imageUrl = '';

  // Si l'utilisateur a téléchargé une image
  if (fileList.length > 0) {
    const uploadedFile = fileList[0];
    imageUrl = `http://localhost:7000/images/${uploadedFile.name}`; // Utilisez le nom du fichier ou l'URL générée
  }

  const formData = {
    ...values,
    imageUrl, // Inclure l'URL de l'image
  };

  try {
    if (editingUser) {
      // Mise à jour de l'utilisateur existant
      const response = await axios.put(`http://localhost:7000/api/updateprofile/${editingUser._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true, // Send cookies with the request
      });
      setUsers(users.map(u => u._id === editingUser._id ? response.data : u));
      message.success('Utilisateur mis à jour avec succès!');
    } else {
      // Création d'un nouvel utilisateur
      const response = await axios.post('http://localhost:7000/api/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true, // Send cookies with the request
      });
      setUsers([...users, response.data]);
      message.success('Utilisateur créé avec succès!');
    }
    window.location.reload();
  } catch (error) {
    message.error('Erreur lors de la création/mise à jour de l\'utilisateur.');
  } finally {
    setLoading(false);
    setIsModalVisible(false);
  }
};


  // Gestion de l'upload d'image
  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:7000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUsers(users.filter(u => u._id !== userId));
      message.success('Utilisateur supprimé avec succès!');
    } catch (error) {
      message.error('Erreur lors de la suppression de l\'utilisateur.');
    }
  };

  const columns = [
    {
      title: 'Photo de profil',
      key: 'profilePicture',
      render: (_, record) => (
        <Avatar src={record.imageUrl} style={{ backgroundColor: '#87d068' }}>
          {!record.imageUrl ? record.name[0].toUpperCase() : null}
        </Avatar>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span style={{ color: role === 'admin' ? 'red' : 'green' }}>
          {role === 'admin' ? 'Admin' : 'Utilisateur'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
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
        Ajouter un utilisateur
      </Button>
      <Table columns={columns} dataSource={users} rowKey={(record) => record._id} />

      <Modal
        title={editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form initialValues={editingUser || { name: "", email: "", role: "user", password: "" }} onFinish={handleOk}>
          <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Rôle">
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">Utilisateur</Option>
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Mot de passe" rules={[{ required: !editingUser }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="imageUrl" label="Photo de profil">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false} // Empêcher l'upload automatique
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>Uploader</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingUser ? "Mettre à jour" : "Créer"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
