import { publicUserApi } from '../api';

// 在组件中使用
const checkUserRole = async () => {
  try {
    const response = await publicUserApi.checkRole();
    if (response.data && response.data.data) {
      return response.data.data.includes('ADMIN');
    }
    return false;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return false;
  }
}; 