<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Operator
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Name">
            <b-form-input id="name" v-model.trim="member.name"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Email">
            <b-form-input id="latitude" v-model.trim="member.email"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter No.HP">
            <b-form-input id="longitude" v-model.trim="member.noHP"></b-form-input>
          </b-form-group>
          
          <b-button class="mx-2 btn-right" type="submit" variant="primary">Update</b-button>
          <b-button class="mx-2 btn-right" variant="danger" @click.stop="$router.go(-1)">Cancel</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

export default {
  name: 'EditHalte',
  data () {
    return {
      key: this.$route.params.id,
      member: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('member').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.member = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = firebase.firestore().collection('member').doc(this.$route.params.id);
      updateRef.set(this.member).then(() => {
        this.key = ''
        this.member.name = ''
        this.member.email = ''
        this.member.noHP = ''
        router.go(-1)
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
    }
  }
}
</script>

<style>
h2{
    text-align: Center;
  }
  .jumbotron {
    padding: 2rem;
  }
  .btn-right{
      float: right;
  }
</style>