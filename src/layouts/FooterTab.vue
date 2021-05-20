<template>
   <q-route-tab :icon="icon" :to="to" size="sm" :class="tabClass" dense>     
      <q-tooltip content-class="bg-black" :offset="[0, -10]">{{label}}</q-tooltip>
   </q-route-tab>  
</template>

<script>
   export default { props: ['label', 'icon', 'to', 'tabClass'] }
</script>
