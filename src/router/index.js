import firebase from '@/Firebase';
import Vue from 'vue';
import Router from 'vue-router';
import HalteList from '@/views/halte/HalteList'
import EditHalte from '@/views/halte/EditHalte'
import RuteList from '@/views/rute/RuteList'
import EditRute from '@/views/rute/EditRute'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Overview from '@/views/Overview'

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
    routes : [
      {
        path: '/',
        redirect: '/login'
      },
      {
        path: '/login',
        name: 'Login',
        component: Login
      },
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: 'halte',
            name: 'HalteList',
            component: HalteList,
          },
          {
            path: 'edit-halte/:id',
            name: 'EditHalte',
            component: EditHalte,
            
          },
          {
            path: 'rute',
            name: 'RuteList',
            component: RuteList,
            
          },
          {
            path: 'edit-rute/:id',
            name: 'EditRute',
            component: EditRute,
            
          },
          {
            path: 'overview',
            name: 'Overview',
            component: Overview,
          }
        ]
      },
    ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

  export default router;
