import React, { useEffect, useState } from "react";
import { Modal, Space, Button, Dropdown, Card, Descriptions, Row, Col, Statistic, Typography, MenuProps, Table, Form, Input } from "antd";
import { EditOutlined, QrcodeOutlined, ScanOutlined, UserOutlined, DownloadOutlined, DownOutlined, SaveOutlined } from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import { ICreateQRCode, IQRCode } from "../types";
import { formatScanDate } from "../helpers";
import { QR_EXPORT_SIZES, SERVER_BASE_URL } from "../../../config/constants";
import { downloadQRCode } from "./download";

interface QRCodeDetailsModalProps {
  qrCode: IQRCode;
  visible: boolean;
  onCancel: () => void;
  onUpdate: (id: string, values: Partial<ICreateQRCode>) => Promise<void>;
}

export const DetailsModal: React.FC<QRCodeDetailsModalProps> = ({ qrCode, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { scans = [] } = qrCode;

  const downloadMenuItems: MenuProps["items"] = QR_EXPORT_SIZES.map((size) => ({
    key: size.value.toString(),
    label: size.label,
    onClick: () => downloadQRCode(qrCode, size.value),
  }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const values = await form.validateFields();
      await onUpdate(qrCode.id, values);

      form.setFieldsValue(values);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      name: qrCode.name,
      originalUrl: qrCode.originalUrl,
    });
    setIsEditing(true);
  };

/*   useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: qrCode.name,
        originalUrl: qrCode.originalUrl,
      });
    }
  }, [qrCode, visible, form]); */

  return (
    <Modal
      title={`Details for [${qrCode.name}]`}
      open={visible}
      onCancel={onCancel}
      width={"70%"}
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
          name: qrCode.name,
          originalUrl: qrCode.originalUrl,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row justify="center">
            <Col>
              <Card style={{ textAlign: "center" }}>
                <QRCodeSVG
                  value={`${SERVER_BASE_URL}s/${qrCode.shortUrl}`}
                  size={200}
                  level="H"
                  style={{
                    margin: "0 auto",
                    backgroundColor: "white",
                  }}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
                <Typography.Paragraph copyable className="mt-4 font-semibold underline underline-offset-4">
                  {SERVER_BASE_URL}s/{qrCode.shortUrl}
                </Typography.Paragraph>

                <Dropdown key="download" menu={{ items: downloadMenuItems }} trigger={["click"]}>
                  <Button type="primary" icon={<DownloadOutlined />}>
                    <Space>
                      Download QR
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Card>
            </Col>
          </Row>

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
                  {isEditing ? <Input /> : <Typography.Text>{qrCode.name}</Typography.Text>}
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
                  <a href={qrCode.originalUrl} target="_blank" rel="noopener noreferrer">
                    {qrCode.originalUrl}
                  </a>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Created">{formatScanDate(qrCode.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Last Modified">{formatScanDate(qrCode.modifiedAt)}</Descriptions.Item>
              <Descriptions.Item label="Last Scan">{formatScanDate(qrCode.lastScan)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Total Scans" value={scans.length} prefix={<ScanOutlined />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Unique Visitors" value={new Set(scans.map((scan) => scan.ipAddress)).size} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Status" value={qrCode.lastScan ? "Active" : "Unused"} prefix={<QrcodeOutlined />} />
              </Card>
            </Col>
          </Row>

          {scans.length > 0 && (
            <Card title="Recent Scans">
              <Table
                dataSource={scans.slice(0, 5)}
                columns={[
                  {
                    title: "Scan Date",
                    dataIndex: "scannedAt",
                    render: formatScanDate,
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
                ]}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          )}
        </Space>
      </Form>
    </Modal>
  );
};
