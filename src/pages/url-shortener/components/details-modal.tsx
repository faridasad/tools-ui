import React, { useState, useEffect } from "react";
import { Modal, Space, Button, Card, Descriptions, Row, Col, Statistic, Typography, Table, Form, Input, Tabs, Spin } from "antd";
import { EditOutlined, LinkOutlined, UserOutlined, SaveOutlined, GlobalOutlined, BarChartOutlined } from "@ant-design/icons";
import { ICreateURL, IURL, IURLAnalytics } from "../../../features/url-shortener/types";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useUrlById } from "../../../features/url-shortener/service";
import { SERVER_BASE_URL } from "../../../config/constants";

interface URLDetailsModalProps {
  url: IURL;
  visible: boolean;
  onCancel: () => void;
  onUpdate: (id: string, values: Partial<ICreateURL>) => Promise<void>;
}

const COLORS = ["#1890ff", "#13c2c2", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#eb2f96"];

export const DetailsModal: React.FC<URLDetailsModalProps> = ({ url, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Fetch analytics data for the current URL
  const { getAnalytics } = useUrlById(url.id);
  const analyticsData = getAnalytics.data as IURLAnalytics;
  const isLoadingAnalytics = getAnalytics.isLoading;

  // If this were a real implementation, we'd fetch click data from the API
  // For now, we'll use the data from the URL object
  const clicks = url.clicks || [];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const values = await form.validateFields();
      await onUpdate(url.id, values);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      name: url.name,
      originalUrl: url.originalUrl,
    });
    setIsEditing(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // Process data for daily clicks chart
  const chartData = analyticsData?.dailyClicks || [];

  // Get top browsers for the pie chart
  const browserData = analyticsData?.browserStats || [];

  // Get top referrers for the bar chart
  const referrerData = analyticsData?.referrerStats || [];

  return (
    <Modal
      title={`Details for [${url.name}]`}
      open={visible}
      onCancel={onCancel}
      width={"80%"}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: url.name,
          originalUrl: url.originalUrl,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card
            extra={
              isEditing ? (
                <Space>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={isSaving}>
                    Save Changes
                  </Button>
                </Space>
              ) : (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Edit Details
                </Button>
              )
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">
                <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: "Name is required" }]}>
                  {isEditing ? <Input /> : <Typography.Text>{url.name}</Typography.Text>}
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Original URL">
                {isEditing ? (
                  <Form.Item
                    name="originalUrl"
                    style={{ margin: 0 }}
                    rules={[
                      { required: true, message: "URL is required" },
                      { type: "url", message: "Please enter a valid URL" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                    {url.originalUrl}
                  </a>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Short URL">
                <a href={SERVER_BASE_URL + "v/" + url.shortUrl} target="_blank" rel="noopener noreferrer">
                  {SERVER_BASE_URL + "v/" + url.shortUrl}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Created">{formatDate(url.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Last Modified">{formatDate(url.modifiedAt)}</Descriptions.Item>
              <Descriptions.Item label="Last Click">{formatDate(url.lastClick!)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic title="Total Clicks" value={analyticsData?.totalClicks || url.clickCount || 0} prefix={<LinkOutlined />} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Unique Visitors" value={url.clicks ? new Set(url.clicks.map((click) => click.ipAddress)).size : 0} prefix={<UserOutlined />} />
              </Card>
            </Col>
          </Row>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "1",
                label: "Recent Clicks",
                children: (
                  <Card>
                    <Table
                      dataSource={clicks.slice(0, 10)}
                      columns={[
                        {
                          title: "Click Date",
                          dataIndex: "clickedAt",
                          render: formatDate,
                        },
                        {
                          title: "IP Address",
                          dataIndex: "ipAddress",
                        },
                        {
                          title: "User Agent",
                          dataIndex: "userAgent",
                          ellipsis: true,
                        },
                        {
                          title: "Referrer",
                          dataIndex: "referer",
                          ellipsis: true,
                        },
                      ]}
                      pagination={{ pageSize: 5 }}
                      rowKey="id"
                      size="small"
                    />
                  </Card>
                ),
              },
              {
                key: "2",
                label: "Analytics",
                children: isLoadingAnalytics ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                    <Typography.Paragraph style={{ marginTop: "20px" }}>Loading analytics data...</Typography.Paragraph>
                  </div>
                ) : (
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Card title="Daily Clicks" className="analytics-card">
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="count" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title="Browser Distribution" className="analytics-card">
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie data={browserData} dataKey="count" nameKey="browser" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ browser, count }) => `${browser}: ${count}`}>
                                {browserData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="Top Referrers" className="analytics-card">
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={referrerData}>
                              <XAxis dataKey="referrer" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#52c41a" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                    </Row>
                  </Space>
                ),
              },
            ]}
          />
        </Space>
      </Form>
    </Modal>
  );
};
