<template>
   <div>
      <q-scroll-area v-if="$q.platform.is.desktop" style="height: 500px;">
         <Timeline :id="twitterId" sourceType="profile" :options="{ tweetLimit: '5' }"/>
      </q-scroll-area> 
      <Timeline v-else :id="twitterId" sourceType="profile" :options="{ tweetLimit: '1' }"/>
   </div>
</template>

<script>
   import { Timeline } from 'vue-tweet-embed'
   
	export default {
      props: ['twitterId'],
      components: {
         Timeline,
      },
   }
</script>
