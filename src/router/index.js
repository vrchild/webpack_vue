import { createRouter ,createWebHistory } from 'vue-router'

const Home = () => import('../views/Home')
const About = () => import('../views/About')

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Home',
      component: Home
    },
    {
      path: '/About',
      component: About
    }
  ]
})
