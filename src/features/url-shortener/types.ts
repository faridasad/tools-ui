export interface ICreateURL {
  name: string;
  originalUrl: string;
}

export interface IURL {
  id: string;
  name: string;
  originalUrl: string;
  shortUrl: string;
  fullShortUrl: string;
  clickCount?: number;
  lastClick?: string;
  createdAt: string;
  modifiedAt: string;
  clicks?: IURLClick[];
}

export interface IURLClick {
  id: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
  clickedAt: string;
}

export interface IURLAnalytics {
  url: IURL;
  totalClicks: number;
  dailyClicks: { date: string; count: number }[];
  browserStats: { browser: string; count: number }[];
  referrerStats: { referrer: string; count: number }[];
}
