import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/main'
import Login from '../views/login'
import UserList from '@/views/data/userList.vue'
import Home from '@/views/data/home.vue'
import ShopList from '@/views/data/shopList.vue'
import AdminList from '@/views/data/adminList.vue'
import OrderList from '@/views/data/orderList.vue'
import FoodList from '@/views/data/foodList.vue'
import UserDistribution from '@/views/data/userDistribution.vue'
import AddShop from '@/views/data/addShop.vue'
import AddFood from '@/views/data/addFood.vue'
import AdminSet from '@/views/data/adminSet.vue'
import Illustration from '@/views/data/illustration.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      { path: '', redirect: '/login', },
      { path: 'home', component: Home, },
      { path: 'userlist', component: UserList, },
      { path: 'shoplist', component: ShopList, },
      { path: 'adminlist', component: AdminList, },
      { path: 'orderlist', component: OrderList, },
      { path: 'foodlist', component: FoodList, },
      { path: 'userdistribution', component: UserDistribution, },
      { path: 'addshop', component: AddShop, },
      { path: 'addfood', component: AddFood, },
      { path: 'adminSet', component: AdminSet, },
      { path: 'illustration', component: Illustration, },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
