import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import { DashboardOutlined, QrcodeOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/qr-codes",
      icon: <QrcodeOutlined />,
      label: <Link to="/qr-codes">QR Codes</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ padding: 16 }}>
          <Title level={5} style={{ color: "white", margin: 0 }}>
            {collapsed ? "ASAN" : "ASAN Tools"}
          </Title>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 16px", background: "#fff" }}>
          <Title level={4} style={{ margin: "16px 0" }}>
            {menuItems.find((item) => item.key === location.pathname)?.label}
          </Title>
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
