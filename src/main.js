import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import firebase from '@/Firebase'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/app.scss'
import Multiselect from 'vue-multiselect'
import Vuelidate from 'vuelidate'


// register globally
Vue.component('multiselect', Multiselect);
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Vuelidate);



Vue.config.productionTip = false;
let app = '';
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      linkActiveClass: "active", // active class for non-exact links.
      linkExactActiveClass: "active", // active class for *exact* links.
      render: h => h(App)
    }).$mount('#app');
  }
});