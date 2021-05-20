<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Current Activity</div>
      <user-items :beginDate="beginDate" :route="route"/> 
	</q-page>
</template>

<script>
	import { Route } from 'src/utils/Constants'

	export default {
		computed: {
         route() { return Route.CURRENT },
			beginDate() { return new Date().getTime() - 1000*60*60*24*3 } // 3 days ago in millis
      },
		components: {
	  		'user-items' : require('components/User/UserItems.vue').default,
      },
	}

</script>
