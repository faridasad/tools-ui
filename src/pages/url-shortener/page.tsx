import React, { useState } from "react";
import { Typography, Button, Card, Space, Empty, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUrlService } from "../../features/url-shortener/service";
import { URLList } from "./components/list";
import { URLCreateModal } from "./components/create-modal";

const URLShortenerPage: React.FC = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { urls, isLoading, createUrl, updateUrl, deleteUrl } = useUrlService();

  const handleCreate = async (values: any) => {
    try {
      await createUrl.mutateAsync(values);
      setIsCreateModalVisible(false);
    } catch (error) {
      console.error("Failed to create URL:", error);
    }
  };

  const handleUpdate = async (id: string, values: any) => {
    try {
      return await updateUrl.mutateAsync({ id, data: values });
    } catch (error) {
      console.error("Failed to update URL:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete URL:", error);
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
            URL Shortener
          </Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
            Create URL
          </Button>
        </div>

        {urls && urls.length > 0 ? (
          <URLList urls={urls} isLoading={isLoading} onDelete={handleDelete} onUpdate={handleUpdate} />
        ) : (
          <Empty
            description={
              <Space direction="vertical" align="center">
                <Typography.Text>No shortened URLs yet</Typography.Text>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  Create your first URL
                </Button>
              </Space>
            }
          />
        )}

        <URLCreateModal visible={isCreateModalVisible} onCancel={() => setIsCreateModalVisible(false)} onSubmit={handleCreate} isLoading={createUrl.isPending} />
      </Card>
    </div>
  );
};

export default URLShortenerPage;
