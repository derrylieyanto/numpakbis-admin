import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';
import HalteList from '@/components/halte/HalteList'
import ShowHalte from '@/components/halte/ShowHalte'
import AddHalte from '@/components/halte/AddHalte'
import EditHalte from '@/components/halte/EditHalte'
import Login from '@/views/Login'
import Home from '@/views/Home'

Vue.use(Router)

const router = new Router({
    routes : [
        {
            path: '*',
            redirect: '/login'
          },
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
            }
          },
      
        {
          path: '/halte',
          name: 'HalteList',
          component: HalteList,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/show-halte/:id',
          name: 'ShowHalte',
          component: ShowHalte,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/add-halte',
          name: 'AddHalte',
          component: AddHalte,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/edit-halte/:id',
          name: 'EditHalte',
          component: EditHalte,
          meta: {
            requiresAuth: true
          }
        }
      ]
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
    if (requiresAuth && !currentUser) next('login');
    else if (!requiresAuth && currentUser) next('home');
    else next();
})

  export default router
