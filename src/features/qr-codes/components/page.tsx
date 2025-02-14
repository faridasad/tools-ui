// src/features/qr-codes/QRCodesPage.tsx
import React, { useState } from "react";
import { Space, Typography, Button, message, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQRCodes } from "../service";
import { ICreateQRCode, IQRCode } from "../types";
import { QRCodeList } from "./list";
import { QRCodeCreateModal } from "./create-modal";

const { Title } = Typography;

export const QRCodesPage: React.FC = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { qrCodes, isLoading, createQRCode, deleteQRCode, updateQRCode } = useQRCodes();

  const handleCreate = async (values: ICreateQRCode) => {
    try {
      await createQRCode.mutateAsync(values);
      message.success("QR Code created successfully");
      setIsCreateModalVisible(false);
    } catch (error) {
      message.error("Failed to create QR Code");
    }
  };

  const handleUpdate = async (id: string, values: Partial<ICreateQRCode>) => {
    try {
      const data = await updateQRCode.mutateAsync({ id, data: values });
      message.success("QR Code updated successfully");

      return data as IQRCode;
    } catch (error) {
      message.error("Failed to update QR Code");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQRCode.mutateAsync(id);
      message.success("QR Code deleted successfully");
    } catch (error) {
      message.error("Failed to delete QR Code");
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>QR Codes Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          Create QR Code
        </Button>
      </div>

      <Card>
        <QRCodeList 
          qrCodes={qrCodes} 
          isLoading={isLoading} 
          onDelete={handleDelete} 
          onUpdate={handleUpdate} 
        />
      </Card>

      <QRCodeCreateModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreate}
        isLoading={createQRCode.isPending}
      />
    </Space>
  );
};