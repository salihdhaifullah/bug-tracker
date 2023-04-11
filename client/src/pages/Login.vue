<template>
    <div class="container mx-auto p-4" id="login-page">
      <h1 class="text-3xl text-center font-bold mb-4">Login</h1>
      <form @submit="handleSubmit" class="space-y-4">
        <TextField id="email" label="Email" type="email" v-model:value="email" />
        <TextField id="password" label="Password" type="password" v-model:value="password" />
        <button  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed" :disabled="!isValid" type="submit">Submit</button>
      </form>
    </div>
  </template>

<script lang="ts">
import TextField from "../components/TextFiled.vue";

export default {
    name: 'Login',
    template: '#login-page',
    components: {
      TextField
    },
    data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit(event: Event) {
      event.preventDefault();
      console.log(this.email);
      console.log(this.password);
      this.email = "";
      this.password = "";
    }
  },
  computed: {
    isValid() {
      return ((this.email !== "") && (this.password !== ""));
    },
  },
  watch: {
    email(newValue) {
      this.email = newValue;
    },
    password(newValue) {
      this.password = newValue;
    },
  },
}

</script>
