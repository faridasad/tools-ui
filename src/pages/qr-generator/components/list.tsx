import React, { useState } from "react";
import { Table, Space, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { IQRCode } from "../../../features/qr-codes/types";
import { formatScanDate } from "../../../features/qr-codes/helpers";
 import { DetailsModal } from "./details-modal";

interface QRCodeListProps {
  qrCodes: IQRCode[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<IQRCode | undefined>;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({ qrCodes, isLoading, onDelete, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const selectedQr = qrCodes.find((qr) => qr.id === selectedId);

  const handleUpdate = async (id: string, values: any) => {
    if (!selectedQr || id !== selectedId) return;

    try {
      const updatedQR = await onUpdate(selectedQr.id, values);
      
      if(!updatedQR) return;
    } finally {
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Scan Count",
      dataIndex: "scanCount",
      key: "scanCount",
      sorter: (a: IQRCode, b: IQRCode) => (a.scanCount || 0) - (b.scanCount || 0),
    },
    {
      title: "Last Scan",
      dataIndex: "lastScan",
      key: "lastScan",
      render: formatScanDate,
      sorter: (a: IQRCode, b: IQRCode) => {
        if (!a.lastScan) return 1;
        if (!b.lastScan) return -1;
        return new Date(a.lastScan).getTime() - new Date(b.lastScan).getTime();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IQRCode) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedId(record.id);
              setIsDetailsVisible(true);
            }}
          />
          {/*           <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedQR(record);
              setIsEditModalVisible(true);
            }}
          /> */}
          <Popconfirm title="Are you sure you want to delete this QR code?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={qrCodes} loading={isLoading} rowKey="id" pagination={false} />

      {/* Details Modal */}
      {(selectedId && selectedQr) && <DetailsModal qrCode={selectedQr} visible={isDetailsVisible} onCancel={() => setIsDetailsVisible(false)} onUpdate={handleUpdate} />}

      {/* Edit Modal */}
      {/* {selectedQR && <QRCodeEditModal qrCode={selectedQR} visible={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)} onSubmit={handleUpdate} isLoading={updateLoading} />} */}
    </>
  );
};
