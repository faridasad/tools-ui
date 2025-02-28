// src/features/auth/pages/register-page.tsx
import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const { Title } = Typography;

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  
  // Get register function and loading state from auth store
  const { register, isAuthPending } = useAuthStore();

  const onFinish = (values: { 
    email: string; 
    password: string; 
    fullName: string; 
    confirmPassword: string 
  }) => {
    const { email, password, fullName } = values;
    
    // Call the register method from our auth store
    register(email, password, fullName);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop: 100 }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Register for ASAN TOOLS
        </Title>
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please input your full name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={isAuthPending}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};