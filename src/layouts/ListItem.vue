<template>
   <q-item clickable :to="path" v-close-popup><q-item-section style="bg-black">{{label}}</q-item-section></q-item>
</template>

<script>
  export default { props: ['path', 'label'] }
</script>
