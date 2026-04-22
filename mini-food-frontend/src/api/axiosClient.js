import axios from 'axios';

// Ensure G_URL doesn't have a trailing slash if the services start with one
const G_URL = process.env.REACT_APP_GATEWAY_URL || 'http://localhost:9000';

const createInstance = (servicePath, fallback) => {
  return axios.create({
    baseURL: `${G_URL}${servicePath || fallback}`
  });
};

export const userApi = createInstance(process.env.REACT_APP_USER_SERVICE, '/api/user');
export const foodApi = createInstance(process.env.REACT_APP_FOOD_SERVICE, '/api/foods');
export const orderApi = createInstance(process.env.REACT_APP_ORDER_SERVICE, '/api/orders');
export const paymentApi = createInstance(process.env.REACT_APP_PAYMENT_SERVICE, '/api/payments');