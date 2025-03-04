// src/features/qr-codes/QRCodesPage.tsx
import React, { useState } from "react";
import { Space, Typography, Button, message, Card, Spin, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQRCodes } from "../../features/qr-codes/service";
import { ICreateQRCode, IQRCode } from "../../features/qr-codes/types";
import { QRCodeList } from "./components/list";
import { QRCodeCreateModal } from "./components/create-modal";

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

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            QR Generator
          </Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
            Create QR Code
          </Button>
        </div>

        {qrCodes && qrCodes.length > 0 ? (
          <QRCodeList qrCodes={qrCodes} isLoading={isLoading} onDelete={handleDelete} onUpdate={handleUpdate} />
        ) : (
          <Empty
            description={
              <Space direction="vertical" align="center">
                <Typography.Text>No QR Codes found</Typography.Text>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  Create your first QR Code
                </Button>
              </Space>
            }
          />
        )}

        <QRCodeCreateModal visible={isCreateModalVisible} onCancel={() => setIsCreateModalVisible(false)} onSubmit={handleCreate} isLoading={createQRCode.isPending} />
      </Card>
    </div>
  );
};
