import firebase from '@/Firebase';
import Vue from 'vue';
import Router from 'vue-router';
import HalteList from '@/views/halte/HalteList'
import EditHalte from '@/views/halte/EditHalte'
import RuteList from '@/views/rute/RuteList'
import EditRute from '@/views/rute/EditRute'
import MemberList from '@/views/member/MemberList'
import EditMember from '@/views/member/EditMember'
import OperatorList from '@/views/operator/OperatorList'
import EditOperator from '@/views/operator/EditOperator'
import BRTList from '@/views/BRT/BRTList'
import EditBRT from '@/views/BRT/EditBRT'
import PlatList from '@/views/plat/PlatList'
import EditPlat from '@/views/plat/EditPlat'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Monitoring from '@/views/Monitoring'
import Report from '@/views/Report'
import Overview from '@/views/Overview'

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  linkExactActiveClass: 'is-active',
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
            path: 'member',
            name: 'MemberList',
            component: MemberList,
            
          },
          {
            path: 'edit-member/:id',
            name: 'EditMember',
            component: EditMember,
            
          },
          {
            path: 'operator',
            name: 'OperatorList',
            component: OperatorList,
            
          },
          {
            path: 'edit-operator/:id',
            name: 'EditOperator',
            component: EditOperator,
            
          },
          {
            path: 'BRT',
            name: 'BRTList',
            component: BRTList,
            
          },
          {
            path: 'edit-BRT/:id',
            name: 'EditBRT',
            component: EditBRT,
            
          },
          {
            path: 'plat',
            name: 'PlatList',
            component: PlatList,
            
          },
          {
            path: 'edit-plat/:id',
            name: 'EditPlat',
            component: EditPlat,
            
          },
          {
            path: 'monitoring',
            name: 'Monitoring',
            component: Monitoring,
          },
          {
            path: 'report',
            name: 'Report',
            component: Report,
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
