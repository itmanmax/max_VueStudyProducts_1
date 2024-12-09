import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { ElMessage } from 'element-plus';

export const useUserInfo = () => {
  const userStore = useUserStore();
  
  // 登录表单数据
  const loginForm = ref({
    identifier: '',
    password: ''
  });
  
  // 注册表单数据
  const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  
  // 对话框显示状态
  const loginDialogVisible = ref(false);
  const registerDialogVisible = ref(false);
  const adminLoginDialogVisible = ref(false);

  // 管理员登录表单
  const adminLoginForm = ref({
    username: '',
    password: ''
  });
  
  // 显示登录对话框
  const showLoginDialog = () => {
    loginDialogVisible.value = true;
  };

  // 显示注册对话框
  const showRegisterDialog = () => {
    registerDialogVisible.value = true;
  };

  // 显示管理员登录对话框
  const showAdminLoginDialog = () => {
    adminLoginDialogVisible.value = true;
  };
  
  // 处理登录
  const handleLogin = async () => {
    const success = await userStore.handleLogin({
      account: loginForm.value.identifier,
      password: loginForm.value.password
    });
    
    if (success) {
      loginDialogVisible.value = false;
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致');
      return;
    }

    const success = await userStore.handleRegister(registerForm.value);
    if (success) {
      registerDialogVisible.value = false;
      // 自动填充登录表单
      loginForm.value.identifier = registerForm.value.email;
      showLoginDialog();
    }
  };

  // 处理管理员登录
  const handleAdminLogin = async () => {
    const success = await userStore.handleAdminLogin({
      username: adminLoginForm.value.username,
      password: adminLoginForm.value.password
    });
    
    if (success) {
      adminLoginDialogVisible.value = false;
    }
  };

  return {
    isLoggedIn: userStore.isLoggedIn,
    userInfo: userStore.userInfo,
    loginForm,
    registerForm,
    adminLoginForm,
    loginDialogVisible,
    registerDialogVisible,
    adminLoginDialogVisible,
    handleLogin,
    handleRegister,
    handleAdminLogin,
    showLoginDialog,
    showRegisterDialog,
    showAdminLoginDialog,
    handleLogout: userStore.handleLogout
  };
}; 
