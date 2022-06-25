import axios from 'axios'
export const http = axios.create({
  baseURL: 'http://elm.cangdu.org',
  mode: 'cors',
  cache: 'force-cache',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
// 登陆
export const login = data => axios.post('/admin/login', data)
// 退出
export const signout = () => axios.get('/admin/signout')
//  获取用户信息
export const getAdminInfo = () => axios.get('/admin/info')

// 获取定位
export const cityGuess = () => http.get('/v1/cities', { params: { type: 'guess', }, })
// 获取地址
export const getAddress = addressId => http.get('/v1/addresse/' + addressId)
// 获取搜索地址
export const searchplace = data => http.get('/v1/pois', {
  params: {
    type: 'search',
    city_id: data.cityid,
    keyword: data.value,
  },
})

// 商家列表
export const getShopList = data => http.get('/shopping/restaurants', { params: data, })
// 商家数量
export const getShopCount = () => http.get('/shopping/restaurants/count')
// 获取商家详细信息
export const getShop = shopId => http.get('/shopping/restaurant/' + shopId)
// 更新商家信息
export const updateShop = data => axios.post('/shopping/updateshop', data)
// 删除商家
export const deleteShop = shopId => axios.delete('/shopping/restaurant/' + shopId)
// 添加商铺
export const addShop = data => axios.post('/shopping/addShop', data)

// 订单列表
export const getOrderList = data => http.get('/bos/orders', { params: data, })
// 订单日数量
export const getOrderDailyCount = data => http.get('/statis/order/' + data + '/count')
// 订单数量
export const getOrderCount = () => http.get('/bos/orders/count')

// 用户列表
export const getUserList = data => http.get('/v1/users/list', { params: data, })
// 用户信息
export const getUser = userId => http.get('/v1/user/' + userId)
// 用户日数据
export const getUserDailyCount = data => http.get('/statis/user/' + data + '/count')
// 用户数量
export const getUserCount = () => http.get('/v1/users/count')
// 获取用户分布信息
export const getUserDistribution = () => http.get('/v1/user/city/count')

// 管理员列表
export const getAdminList = data => http.get('/admin/all', { params: data, })
// 管理员日数量
export const getAdminDailyCount = data => http.get('/statis/admin/' + data + '/count')
// 管理员数量
export const getAdminCount = () => http.get('/admin/count')

// 添加食品
export const addFood = data => axios.post('/shopping/addfood', data)
// 获取食品列表
export const getFoodList = data => http.get('/shopping/v2/foods', { params: data, })
// 获取食品数量
export const getFoodCount = data => http.get('/shopping/v2/foods/count', data)
// 更新食品信息
export const updateFood = data => axios.post('/shopping/v2/updatefood', data)
// 删除食品
export const deleteFood = foodId => axios.delete('/shopping/v2/food/' + foodId)

// 种类列表
export const getFoodCategoryList = () => http.get('/shopping/v2/restaurant/category')
// 获取种类
export const getFoodCategory = categoryId => http.get('/shopping/v2/menu/' + categoryId)
// 获取种类列表
export const getCategory = data => http.get('/shopping/v2/menu', data)
// 获取当前店铺食品种类
export const getShopCategory = restaurantId => http.get('/shopping/getcategory/' + restaurantId)
// 添加食品种类
export const addCategory = data => http.post('/shopping/addcategory', data)
//  category 种类列表
export const foodCategory = (latitude, longitude) => http.get('/shopping/v2/restaurant/category', { latitude, longitude, })

// 获取menu列表
export const getMenu = data => http.get('/shopping/v2/menu', data)
// 获取menu详情
export const getMenuById = categoryId => http.get('/shopping/v2/menu/' + categoryId)
