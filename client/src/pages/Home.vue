<template>
    <div id="home-page">
        <h1> Hello World From Home Page </h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde nisi sequi explicabo commodi perferendis rem,
            dignissimos ipsum facere impedit amet nam, eos nemo illum molestiae odit a aliquam, atque maxime.
        </p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Home',
    template: '#home-page'
}
</script>

<style scoped>
h1 {
    color: #292929;
    font-size: 2rem;
    text-align: center;
}

p {
    color: rgb(50, 50, 252);
    font-size: 22px;
    text-align: center;
}
</style>
