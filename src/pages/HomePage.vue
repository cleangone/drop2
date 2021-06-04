<template>
	<q-page class="row justify-center" :class="pageClass">
      <div class="col-1 q-mt-none q-gutter-y-md" :style="mainColWidth" :class="blue"> 
         <!-- {{ $q.screen.width }}, {{ $q.screen.height }} -->
         <install-app-banner />
         <drop v-for="(drop, key) in primaryDrops" :key="'prime'+key" :drop="drop" />
         <twitter v-if="hasTwitterId" :twitterId="twitterId" style="width: 400px" />
         <drop v-for="(drop, key) in secondaryDrops" :key="'second'+key" :drop="drop" />
      </div>
      <recent-items class="col q-mt-none" :class="indigo"/>
	</q-page>
</template> 

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
   import { Colors } from 'src/utils/Constants'
   import { getIds } from 'src/utils/Utils'

	export default {
      computed: {
         ...mapGetters('drop', ['getDrops', 'getPrimaryDrops', 'getSecondaryDrops']),
         ...mapGetters('setting', ['getSettings']),
         ...mapGetters('color', Colors),

         // todo - doesn't work because drop image width drives col
         // need to do a lot of work on small sizing - dynamic width of images, remove padding in main panel 
         mainColWidth() { 
            return "width:400px" 
            // "width:" + (this.$q.screen.width < 400 ? this.$q.screen.width: 400) + "px" 
            },
         pageClass() { 
            return (this.$q.platform.is.mobile ? "q-pa-sm q-gutter-xs " : "q-pa-md q-gutter-md ") + this.pink
         },
         primaryDrops() {return this.sortDrops(this.getPrimaryDrops) }, 
         secondaryDrops() { return this.sortDrops(this.getSecondaryDrops) }, 
         hasTwitterId() { return this.twitterId && this.twitterId.length > 0 },
         twitterId() { return this.getSettings.twitterId },
      },
      methods: {
         sortDrops(drops) { 
            return drops.sort((a, b) => (DropMgr.homePosition(a) < DropMgr.homePosition(b) ? -1 : 1))
         }
      },
      components: {
         'drop' : require('components/Drop/Drop.vue').default,
         'recent-items' : require('components/Item/RecentItems.vue').default,
         'twitter' : require('components/General/Twitter.vue').default,
         'install-app-banner' : require('components/General/InstallAppBanner.vue').default,
      },
	}
</script>

<style lang="scss">
</style>
