<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Plat Nomor
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="No.Plat">
            <b-form-input id="noPlat" v-model.trim="plat_bus.noPlat"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="City">
            <b-form-input id="city" v-model.trim="plat_bus.city"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Type">
            <b-form-input id="type" v-model.trim="plat_bus.type"></b-form-input>
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
  name: 'EditPlat',
  data () {
    return {
      key: this.$route.params.id,
      plat_bus: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('plat_bus').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.plat_bus = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = firebase.firestore().collection('plat_bus').doc(this.$route.params.id);
      updateRef.set(this.plat_bus).then(() => {
        this.key = ''
        this.plat_bus.noPlat = ''
        this.plat_bus.type = ''
        this.plat_bus.city = ''
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