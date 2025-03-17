// src/features/auth/pages/login-page.tsx
import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const { Title } = Typography;

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  
  // Get auth store methods and state
  const { login, isAuthPending } = useAuthStore();

  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    await login(email, password);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop: 100 }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Login to ASAN TOOLS
        </Title>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
            rules={[{ required: true, message: "Please input your password!" }]}
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
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register">Register now</Link>
        </div>
      </Card>
    </div>
  );
};