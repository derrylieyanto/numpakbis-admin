<template>
  <div class="home">
    <HalteList/>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import HalteList from '@/components/halte/HalteList.vue'
export default {
  name: 'home',
  components: {
    HalteList
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>