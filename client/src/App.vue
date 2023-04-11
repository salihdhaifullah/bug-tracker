<template>
  <p className="continuer">
    <router-link class="link" to="/">Home</router-link>
    <router-link class="link" to="/sing-up">SingUp</router-link>
    <router-link class="link" to="/login">Login</router-link>
  </p>

  <router-view></router-view>
</template>

<style scoped>
.link {
  @apply text-[20px] text-blue-600 hover:text-blue-500 font-[20px]
}
.continuer {
  @apply flex flex-row gap-4
}
</style>
