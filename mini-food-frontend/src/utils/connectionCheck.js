import { userApi, foodApi, orderApi, paymentApi } from '../api/axiosClient';

export const checkAllConnections = async () => {
  const services = [
    { name: 'USER-SERVICE', api: userApi },
    { name: 'FOOD-SERVICE', api: foodApi },
    { name: 'ORDER-SERVICE', api: orderApi },
    { name: 'PAYMENT-SERVICE', api: paymentApi },
  ];

  console.log("%c--- ĐANG KIỂM TRA KẾT NỐI MICROSERVICES ---", "color: blue; font-weight: bold;");

  for (const service of services) {
    try {
      await service.api.get('/');
      console.log(`%c✅ ${service.name}: Kết nối thành công!`, "color: green;");
    } catch (error) {
      if (error.response) {
        // Có response (dù 404, 401, 403) = server đang chạy, chỉ là endpoint sai hoặc cần auth
        console.log(`%c🟡 ${service.name}: Server đang chạy (HTTP ${error.response.status})`, "color: orange;");
      } else {
        // Không có response = CORS hoặc server tắt
        console.error(`%c❌ ${service.name}: Không kết nối được (CORS hoặc server tắt)`, "color: red;");
      }
    }
  }
};