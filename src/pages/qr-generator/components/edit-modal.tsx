// src/features/qr-codes/QRCodeEditModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { ICreateQRCode, IQRCode } from '../../../features/qr-codes/types';

interface QRCodeEditModalProps {
  qrCode: IQRCode;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ICreateQRCode) => Promise<void>;
  isLoading: boolean;
}

export const QRCodeEditModal: React.FC<QRCodeEditModalProps> = ({
  qrCode,
  visible,
  onCancel,
  onSubmit,
  isLoading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && qrCode) {
      form.setFieldsValue({
        name: qrCode.name,
        originalUrl: qrCode.originalUrl,
      });
    }
  }, [visible, qrCode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit QR Code"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: qrCode.name,
          originalUrl: qrCode.originalUrl,
        }}
      >
        <Form.Item
          label="QR Code Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the QR code name!' },
            { max: 255, message: 'Name cannot exceed 255 characters!' },
          ]}
        >
          <Input placeholder="Enter QR code name" />
        </Form.Item>

        <Form.Item
          label="Original URL"
          name="originalUrl"
          rules={[
            { required: true, message: 'Please input the URL!' },
            { type: 'url', message: 'Please enter a valid URL!' },
            { max: 2048, message: 'URL cannot exceed 2048 characters!' },
          ]}
          help="The destination URL where users will be redirected when scanning the QR code"
        >
          <Input placeholder="https://example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};