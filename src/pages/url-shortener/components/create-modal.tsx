import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { ICreateURL } from "../../../features/url-shortener/types";

interface URLCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ICreateURL) => Promise<any>;
  isLoading: boolean;
}

export const URLCreateModal: React.FC<URLCreateModalProps> = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  isLoading 
}) => {
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
      title="Create Shortened URL"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="create_url_form"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter a name for this URL" }]}
        >
          <Input placeholder="Marketing Campaign" />
        </Form.Item>

        <Form.Item
          name="originalUrl"
          label="Original URL"
          rules={[
            { required: true, message: "Please enter the URL to shorten" },
            { type: "url", message: "Please enter a valid URL" }
          ]}
        >
          <Input placeholder="https://example.com/long-url" />
        </Form.Item>
      </Form>
    </Modal>
  );
};