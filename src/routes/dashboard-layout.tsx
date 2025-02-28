import React, { useState } from "react";
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from "antd";
import { DashboardOutlined, QrcodeOutlined, SettingOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthAPI } from "../features/auth/api";
import { useAuthStore } from "../store/auth";

const { Header, Sider, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("asan-tools-token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {collapsed ? "AT" : "ASAN TOOLS"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname.split("/")[1] || "dashboard"]}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/dashboard"),
            },
            {
              key: "qr-codes",
              icon: <QrcodeOutlined />,
              label: "QR Codes",
              onClick: () => navigate("/qr-codes"),
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: () => navigate("/settings"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  label: "Profile",
                  icon: <UserOutlined />,
                },
                {
                  key: "logout",
                  label: "Logout",
                  icon: <LogoutOutlined />,
                  onClick: handleLogout,
                  danger: true,
                },
              ],
            }}
          >
            <Space>
              <span>{user?.fullName}</span>
              <Avatar icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
