// src/features/qr-codes/components/QRCodeCreateModal.tsx
import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { ICreateQRCode } from "../types";

interface QRCodeCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ICreateQRCode) => Promise<void>;
  isLoading: boolean;
}

export const QRCodeCreateModal: React.FC<QRCodeCreateModalProps> = ({ visible, onCancel, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error: any) {
      // Form validation error is handled by Ant Design
      if (error.errorFields) {
        return;
      }
      throw error;
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Create New QR Code"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the QR code name!" },
            { max: 255, message: "Name cannot exceed 255 characters!" },
          ]}
        >
          <Input placeholder="Enter QR code name" />
        </Form.Item>

        <Form.Item
          label="Original URL"
          name="originalUrl"
          rules={[
            { required: true, message: "Please input the URL!" },
            { type: "url", message: "Please enter a valid URL!" },
            { max: 2048, message: "URL cannot exceed 2048 characters!" },
          ]}
          help="The destination URL where users will be redirected when scanning the QR code"
        >
          <Input placeholder="https://example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
