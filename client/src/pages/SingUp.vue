<template>
    <div class="container mx-auto p-4" id="sing-up-page">
        <h1 class="title"> SingUp </h1>
        <form @submit="handleSubmit" class="space-y-4">
        <TextField id="email" label="Email" type="email" v-model:value="email" />
        <TextField id="password" label="Password" type="password" v-model:value="password" />
        <div class="name-container">
            <TextField id="firstName" label="First Name" type="text" v-model:value="firstName" />
            <TextField id="lastName" label="Last Name" type="text" v-model:value="lastName" />
        </div>
        <button class="button" :disabled="!isValid" type="submit">Submit</button>
      </form>
    </div>
</template>

<script lang="ts">
import TextField from "../components/TextFiled.vue";

export default {
    name: 'SingUp',
    template: '#sing-up-page',
    components: {
      TextField
    },
    data() {
    return {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };
  },
  methods: {
    handleSubmit(event: Event) {
      event.preventDefault();
      console.log(this.email);
      console.log(this.password);
      console.log(this.firstName);
      console.log(this.lastName);
      this.email = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
    }
  },
  computed: {
    isValid() {
      return ((this.email !== "") && (this.password !== "") && (this.firstName !== "") && (this.lastName !== ""));
    },
  },
  watch: {
    email(newValue) {
      this.email = newValue;
    },
    password(newValue) {
      this.password = newValue;
    },
    firstName(newValue) {
      this.firstName = newValue;
    },
    lastName(newValue) {
      this.lastName = newValue;
    },
  },
}
</script>


<style scoped>
.button {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed
}
.title {
    @apply text-3xl text-center font-bold mb-4
}
.name-container {
    @apply inline-flex flex-row  gap-4 w-full
}
</style>
