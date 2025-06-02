
const isProduction = process.env.NODE_ENV === 'production';

export const BASE_URL = isProduction ? "https://vknan.pythonanywhere.com" : "http://localhost:5000";