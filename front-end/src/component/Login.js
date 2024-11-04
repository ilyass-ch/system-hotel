import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const mainContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '88vh',
  backgroundColor: '#f5f5f5',
};

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:7000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        Cookies.set('token', data.token, { expires: 7 });

        message.success('Connexion réussie !');
        navigate('/');
        window.location.reload();
      } else {
        message.error('Email ou mot de passe incorrect !');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      message.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div style={mainContainer}>
      <div style={{
        borderRadius: 10,
        padding: '50px',
        border: '1px solid #eee',
        width: '45%',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          width: '100%',
          textAlign: 'center',
          paddingBottom: 20,
          fontWeight: 'bold',
          fontSize: '2em',
          color: '#18458b'
        }}>
          Royale Hotel
        </h1>
        <Form
          style={{ width: '100%' }}
          size='large'
          name='normal_login'
          className='login-form'
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <label>Email address</label>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Veuillez entrer votre email!' },
              { type: 'email', message: 'Veuillez entrer une adresse email valide!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>

          <label>Password</label>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
          >
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
