import { ref } from 'vue'
import { userAuthApi } from '@/api/user'

// 定义登录表单数据
const loginData = ref({
  username: '',
  password: ''
})

// 登录处理函数
const handleLogin = async () => {
  try {
    const response = await userAuthApi.login({
      username: loginData.value.username,
      password: loginData.value.password
    })
    
    // 登录成功后的处理
    if (response) {
      // 存储token
      localStorage.setItem('token', response)
      // 其他登录成功后的操作...
    }
  } catch (error) {
    console.error('登录错误:', error)
  }
}

// 导出组件需要的内容
export {
  loginData,
  handleLogin
} 