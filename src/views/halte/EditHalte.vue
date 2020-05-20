<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Halte
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Name">
            <b-form-input id="name" v-model.trim="halte_bus.name"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Rute">
            <b-form-input id="rute" v-model.trim="halte_bus.rute"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Latitude">
            <b-form-input id="latitude" v-model.trim="halte_bus.latitude"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Longitude">
            <b-form-input id="longitude" v-model.trim="halte_bus.longitude"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Type">
            <b-form-input id="type" v-model.trim="halte_bus.type"></b-form-input>
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
  name: 'EditHalte',
  data () {
    return {
      key: this.$route.params.id,
      halte_bus: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('halte_bus').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.halte_bus = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = firebase.firestore().collection('halte_bus').doc(this.$route.params.id);
      updateRef.set(this.halte_bus).then(() => {
        this.key = ''
        this.halte_bus.name = ''
        this.halte_bus.latitude = ''
        this.halte_bus.longitude = ''
        this.halte_bus.type = ''
        this.halte_bus.rute = ''
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