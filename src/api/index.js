// 导出所有公共接口
export {
  restaurantApi,
  publicDishApi,
  publicTagApi,
  publicUserApi,
  publicCouponApi,
  publicFeedbackApi
} from './public'

// 导出所有管理员接口
export {
  adminAuthApi,
  userManageApi,
  restaurantManageApi,
  dishManageApi,
  tagManageApi,
  couponManageApi,
  feedbackManageApi
} from './admin'

// 导出用户相关接口
export {
  userApi,
  userProfileApi,
  userAuthApi,
  userOperationApi
} from './user' 