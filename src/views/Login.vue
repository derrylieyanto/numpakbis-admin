<template>
   
 
  <div class="login">
       <img width="200px" height="200px" :src="require('@/assets/numpakbis.png')">
     <b-card header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <h6 class="mb-0">Numpak Bis Admin</h6>
      </template>
      <b-card-text>
        <b-row>
          <b-col cols="12">
            <h2>
              Login
            </h2>
            <b-jumbotron>
              <b-form @submit.stop.prevent="onSubmit">
                <b-form-group id="fieldsetHorizontal"
                          class="label"
                          horizontal
                          :label-cols="4"
                          breakpoint="md"
                          label="Enter Email">
                  <b-form-input id="email" v-model.trim="$v.form.email.$model" :state="validateState('email')"
                    aria-describedby="input-1-live-feedback"></b-form-input>
                    <b-form-invalid-feedback
                      id="input-1-live-feedback"
                      class="input-feedback"
                    >Email must be valid.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group id="fieldsetHorizontal"
                          class="label"
                          horizontal
                          :label-cols="4"
                          breakpoint="md"
                          label="Enter Password">
                  <b-form-input type="password" id="password" v-model.trim="$v.form.password.$model" :state="validateState('password')"
                     aria-describedby="input-2-live-feedback"></b-form-input>
                   <b-form-invalid-feedback
                    id="input-2-live-feedback"
                    class="input-feedback"
                  >Password is required.</b-form-invalid-feedback>  
                </b-form-group>
                <b-button class="mx-2 btn-center" type="submit" variant="primary">Login</b-button>
              </b-form>
            </b-jumbotron>
          </b-col>
        </b-row>
      </b-card-text>
      <template v-slot:footer>
        <em>numpakbis-admin</em>
      </template>
    </b-card>


  </div>

</template>


<script>

  import { validationMixin } from "vuelidate";
  import { required, minLength, helpers } from "vuelidate/lib/validators";
  import firebase from 'firebase';
  const mustBeEmail = (value) => !helpers.req(value) || value.indexOf('@') >= 0

  export default {
    mixins: [validationMixin],
    name: 'login',
    data() {
      return {
        form: {
          email: null,
          password: null
        },
      }
    },
     validations: {
      form:{
        email: {
          required,
          mustBeEmail
        },
        password: {
          required,
          minLength: minLength(6)
        }
      }
      
  },
    methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    login: function() {
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then(
        () => {
          this.$router.replace('home/monitoring')
        },
        (err) => {
          alert('Oops. ' + err.message)
        }
      );
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.login();

      this.$nextTick(() => {
        this.$v.$reset();
      });
    }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .login{
    width: 50%;
    margin: 10% auto;
    margin-top: 0;
    text-align: center;
  }
   .btn-center{
    margin: 0 auto;
  }
  .input-feedback{
    text-align: left;
  }
  .label{
    text-align: right;
  }
</style>