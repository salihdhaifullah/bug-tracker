import { createApp } from 'vue'
import "./style.css";
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import SingUp from './pages/SingUp.vue'
import Login from './pages/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/sing-up', component: SingUp },
  { path: '/login', component: Login }
]

const router = createRouter({ history: createWebHistory(), routes })

const app = createApp(App)
app.use(router)
app.mount('#app')
