<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit BRT
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Name">
            <b-form-input id="type" v-model.trim="type_bus.type"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="City">
            <b-form-input id="city" v-model.trim="type_bus.city"></b-form-input>
          </b-form-group>
          <b-button class="mx-2" variant="danger" @click.stop="$router.go(-1)">Cancel</b-button>
          <b-button class="mx-2" type="submit" variant="primary">Update</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

export default {
  name: 'EditBRT',
  data () {
    return {
      key: this.$route.params.id,
      type_bus: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('type_bus').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.type_bus = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = firebase.firestore().collection('type_bus').doc(this.$route.params.id);
      updateRef.set(this.type_bus).then(() => {
        this.key = ''
        this.type_bus.type = ''
        this.type_bus.city = ''
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
</style>