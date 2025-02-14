import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { QrcodeOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";
import { IQRCode } from "../types";
import { useQRCodeScans } from "../service";
import { calculateUniqueVisitors } from "../helpers";

interface QRCodeStatsProps {
  qrCode: IQRCode;
}

export const QRCodeStats: React.FC<QRCodeStatsProps> = ({ qrCode }) => {
  const { data: scans = [] } = useQRCodeScans(qrCode.shortUrl);
  const uniqueVisitors = calculateUniqueVisitors(scans.map((scan) => scan.ipAddress));

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Total Scans" value={scans.length} prefix={<ScanOutlined />} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Unique Visitors" value={uniqueVisitors} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="QR Code Status" value={qrCode.lastScan ? "Active" : "Unused"} prefix={<QrcodeOutlined />} />
        </Card>
      </Col>
    </Row>
  );
};
