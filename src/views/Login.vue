<template>
   
 
  <div class="login">

     <b-card header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <h6 class="mb-0">Numpakbis Admin</h6>
      </template>
      <b-card-text>
        <b-row>
          <b-col cols="12">
            <h2>
              Login
            </h2>
            <b-jumbotron>
              <b-form>
                <b-form-group id="fieldsetHorizontal"
                          horizontal
                          :label-cols="4"
                          breakpoint="md"
                          label="Enter Email">
                  <b-form-input id="email" v-model.trim="email"></b-form-input>
                </b-form-group>
                <b-form-group id="fieldsetHorizontal"
                          horizontal
                          :label-cols="4"
                          breakpoint="md"
                          label="Enter Password">
                  <b-form-input type="password" id="password" v-model.trim="password" @keyup.enter.native="login"></b-form-input>
                </b-form-group>
                <b-button class="mx-2 btn-center" variant="primary" @click.stop="login">Login</b-button>
              </b-form>
            </b-jumbotron>
          </b-col>
        </b-row>
      </b-card-text>
      <template v-slot:footer>
        <em>numpakbis-admin</em>
      </template>
    </b-card>

    <!-- <h3>Sign In</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button @click="login">Login</button> -->
  </div>

</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          () => {
            this.$router.replace('home/monitoring')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .btn-center{
    margin: 0 auto;
  }
  .login{
    width: 50%;
    margin: 10% auto;
    text-align: center;
  }
</style>