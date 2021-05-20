<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Activity</div>
      <user-items :route="route" />  
	</q-page>
</template>

<script>
	import { Route } from 'src/utils/Constants'

	export default {
		computed: {
         route() { return Route.ACTIVITY }
      },
		components: {
	  		'user-items' : require('components/User/UserItems.vue').default,
      },
	}

</script>
