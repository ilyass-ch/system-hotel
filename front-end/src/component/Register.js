import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const mainContainer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "88vh",
  backgroundColor: "#f5f5f5",
};

export default class Signup extends Component {
  onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:7000/api/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Afficher un message de succès
      message.success("Inscription réussie !");
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    } catch (error) {
      // Afficher un message d'erreur
      message.error("Erreur lors de l'inscription. Veuillez réessayer.");
      console.error("Error: ", error);
    }
  };

  render() {
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
            Welcome to Family!
          </h1>
          <Form
            style={{ width: "100%" }}
            size="large"
            name="signup_form"
            className="signup-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <label>Name</label>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Veuillez entrer votre nom!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
              />
            </Form.Item>

            <label>Email address</label>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Veuillez entrer votre email!" },
                { type: "email", message: "Veuillez entrer une adresse email valide!" }
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <label>Password</label>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Veuillez entrer votre mot de passe!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <label>Repeat password</label>
            <Form.Item
              name="repeat_password"
              dependencies={['password']}
              rules={[
                { required: true, message: "Veuillez entrer à nouveau votre mot de passe!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Les deux mots de passe ne correspondent pas!")
                    );
                  },
                }),
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Repeat Password"
              />
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="signup-form-button"
              >
                Sign Up Now
              </Button>

              <Button
                style={{ marginLeft: 10 }}
                type="button"
                className="signup-form-button"
                onClick={() => window.location.href = '/login'}
              >
                Get Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
