import React, { useState } from "react";
import { Table, Space, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { DetailsModal } from "./details-modal";
import { IURL } from "../../../features/url-shortener/types";
import { SERVER_BASE_URL } from "../../../config/constants";

interface URLListProps {
  urls: IURL[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<any>;
}

export const URLList: React.FC<URLListProps> = ({ urls, isLoading, onDelete, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const selectedUrl = urls.find((url) => url.id === selectedId);

  const handleUpdate = async (id: string, values: any) => {
    if (!selectedUrl || id !== selectedId) return;

    try {
      const updatedURL = await onUpdate(selectedUrl.id, values);
      if(!updatedURL) return;
      message.success("URL updated successfully");
    } catch (error) {
      message.error("Failed to update URL");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Short URL",
      dataIndex: "shortUrl",
      key: "fullShortUrl",
      render: (text: string) => (
        <a href={SERVER_BASE_URL + text} target="_blank" rel="noopener noreferrer">
          {SERVER_BASE_URL + 
          text}
        </a>
      ),
    },
    {
      title: "Click Count",
      dataIndex: "clickCount",
      key: "clickCount",
      sorter: (a: IURL, b: IURL) => (a.clickCount || 0) - (b.clickCount || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IURL) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedId(record.id);
              setIsDetailsVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this URL?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={urls}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      {/* Details Modal */}
      {selectedId && selectedUrl && (
        <DetailsModal
          url={selectedUrl}
          visible={isDetailsVisible}
          onCancel={() => setIsDetailsVisible(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};
