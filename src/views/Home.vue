<template>
  
  <div class="home">
    <div id="page-wrapper" class="page-wrapper legacy-theme sidebar-bg bg1 toggled">
        <a id="show-sidebar" @click="closeMenu" class="btn btn-sm btn-dark" href="#">
            <i class="fas fa-bars"></i>
        </a>
        <nav id="sidebar" class="sidebar-wrapper">
            <div class="sidebar-content">
                <!-- sidebar-brand  -->
                <div class="sidebar-item sidebar-brand">
                    <a href="#">Numpakbis Admin</a>
                    <div id="close-sidebar" @click="closeMenu">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <!-- sidebar-header  -->
                <div class="sidebar-item sidebar-header">
                    <div class="user-pic">
                        <img class="img-responsive img-rounded" src="/img/user.png" alt="User picture">
                    </div>
                    <div class="user-info">
                        <span class="user-name">
                            <strong>Welcome</strong>
                        </span>
                        <span class="user-role"> {{email}} </span>
                        <span class="user-status">
                            <i class="fa fa-circle"></i>
                            <span>Online</span>
                        </span>
                    </div>
                </div>
                <!-- sidebar-search  -->
                <!-- <div class="sidebar-item sidebar-search">
                    <div>
                        <div class="input-group">
                            <input type="text" class="form-control search-menu" placeholder="Search...">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div> -->
                <!-- sidebar-menu  -->
                <div class=" sidebar-item sidebar-menu">
                    <ul>
                        <li class="header-menu">
                            <span>Menu</span>
                        </li>

                        <li>
                            <router-link :to="{ name: 'Monitoring'}">
                                <i class="fa fa-chart-line"></i>
                                <span>Monitoring</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'Report'}">
                                <i class="fa fa-table"></i>
                                <span>Report</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/home/BRT">
                                <i class="fas fa-road"></i>
                                <span>BRT</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/home/plat">
                                <i class="fas fa-bus-alt"></i>
                                <span>Plat Nomor Bus</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/home/halte" exact-active-class="">
                                <i class="fas fa-map-marked-alt"></i>
                                <span>Halte Bus</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/home/rute">
                                <i class="fas fa-route"></i>
                                <span>Rute Bus</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/home/member">
                                <i class="fa fa-user"></i>
                                <span>Member</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/home/operator">
                                <i class="fas fa-user-tie"></i>
                                <span>Operator</span>
                            </router-link>
                        </li>     
                        <li>
                            <a href="#" @click="logout">
                                <i class="fa fa-power-off"></i>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <!-- sidebar-menu  -->
            </div>
       
        </nav>
        <!-- sidebar-content  -->
        <main class="page-content">
     
            <router-view/>
        </main>
        <!-- page-content" -->
    </div>
    <!-- page-wrapper -->
    
    
  </div>
</template>

<script>

import firebase from '@/Firebase'

// @ is an alias to /src
// import HalteList from '@/components/halte/HalteList.vue'
export default {
  name: 'Home',
  components: {
    
  },
 
  methods: {
    closeMenu(){
        // We pass the ID of the button that we want to return focus to
        // when the modal has hidden
        var element = document.getElementById("page-wrapper");
        element.classList.toggle("toggled");

    },
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/');
      })
      .catch((err) =>{
        console.log(err);
      });
    }
  },
   created(){
      let user = firebase.auth().currentUser;
      this.email = user.email;
  }
}
</script>

<style>
  .navbar{
    margin-bottom: 20px;
  }
</style>