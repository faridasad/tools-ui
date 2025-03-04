import React from "react";
import { Table, Card, Typography } from "antd";
import { formatScanDate } from "../../../features/qr-codes/helpers";
import { useQRCodeScans } from "../../../features/qr-codes/service";

interface QRCodeScanHistoryProps {
  shortUrl: string;
}

export const QRCodeScanHistory: React.FC<QRCodeScanHistoryProps> = ({ shortUrl }) => {
  const { data: scans = [], isLoading } = useQRCodeScans(shortUrl);

  const columns = [
    {
      title: "Scan Date",
      dataIndex: "scannedAt",
      key: "scannedAt",
      render: formatScanDate,
      sorter: (a: any, b: any) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime(),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
      ellipsis: true,
    },
    {
      title: "Referrer",
      dataIndex: "referer",
      key: "referer",
      ellipsis: true,
    },
  ];

  return (
    <Card>
      <Typography.Title level={4}>Scan History</Typography.Title>
      <Table
        columns={columns}
        dataSource={scans}
        loading={isLoading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} scans`,
        }}
      />
    </Card>
  );
};
