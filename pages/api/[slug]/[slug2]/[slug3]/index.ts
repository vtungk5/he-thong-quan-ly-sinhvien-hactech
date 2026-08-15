import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { Method } from 'axios';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // 1. Xác định URL mục tiêu
  const targetUrl = "https://sinhvien.hactech.edu.vn" + (req.url 
    ? req.url.replace(/^\/api\/proxy/, '') 
    : '');

  // 2. Sao chép headers và xóa 'host' để tránh lỗi unused variable
  const safeHeaders = { ...req.headers };
  delete safeHeaders.host;

  // 3. Kiểm tra phương thức
  const method = (req.method?.toUpperCase() || 'GET') as Method;
  const isBodyAllowed = !['GET', 'HEAD'].includes(method as string);

  try {
    const response = await axios({
      method: method,
      url: targetUrl,
      data: isBodyAllowed ? req.body : undefined, 
      headers: {
        ...safeHeaders,
        host: "sinhvien.hactech.edu.vn",
        origin: "https://sinhvien.hactech.edu.vn",
        referer: "https://sinhvien.hactech.edu.vn/students/student-info", 
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      responseType: 'json',
    });

    res.status(response.status).json(response.data);
  } catch (error: unknown) {
    // 4. Xử lý lỗi an toàn bằng utility của axios
    if (axios.isAxiosError(error)) {
      const serverStatus = error.response?.status || 500;
      const serverData = error.response?.data || { 
        message: "Lỗi phản hồi từ server mục tiêu", 
        error: error.message 
      };
      
      res.status(serverStatus).json(serverData);
    } else if (error instanceof Error) {
      res.status(500).json({ 
        message: "Lỗi hệ thống Proxy", 
        error: error.message 
      });
    } else {
      res.status(500).json({ message: "Lỗi Proxy không xác định" });
    }
  }
}