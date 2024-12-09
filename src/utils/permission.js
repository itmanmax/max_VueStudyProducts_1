// 创建一个通用的权限检查工具
export const checkAdminPermission = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const checkUserPermission = () => {
  return localStorage.getItem('token') !== null;
}; 