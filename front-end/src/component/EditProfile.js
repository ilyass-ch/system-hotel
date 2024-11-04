import React, { useState, useContext } from 'react';
import { Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import UserContext from './UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.profilePicture || '');

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userId = user._id;
      const token = Cookies.get('token');

      // Update user profile data
      const response = await axios.put(
        `http://localhost:7000/api/updateprofile/${userId}`,
        {
          imageUrl: `http://localhost:7000/images/${imageUrl}`,
          ...values, // Add other form values (e.g., name, email)
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true, // Send cookies with the request
        }
      );

      // Update context with new user data
      setUser(response.data);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async ({ file }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('imageUrl', file);

      const token = Cookies.get('token');

      // Upload image
      const response = await axios.post(
        'http://localhost:7000/api/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true, // Send cookies with the request
        }
      );

      // Update context with new image URL
      setUser(prevState => ({
        ...prevState,
        profilePicture: response.data.imageUrl,
      }));
      setImageUrl(file.name);
      message.success('Profile picture updated successfully!');
    } catch (error) {
      message.error('Failed to upload profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: user.name,
          email: user.email,
        }}
      >
        <Form.Item label="Profile Picture">
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Avatar
              src={imageUrl}
              icon={<UserOutlined />}
              size={64}
              style={{ backgroundColor: '#87d068' }}
            />
            <Button icon={<UploadOutlined />} style={{ marginLeft: 10 }} loading={loading}>
              Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
