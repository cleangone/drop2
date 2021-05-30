<template>
   <div>
      <q-img :src="image.thumbUrl" v-on:click="navToItemPage" :style="thumbWH" class="cursor-pointer" 
         @mouseenter="mouseenter($event)" @mouseleave="mouseleave()" basic contain>
         <!-- <q-icon name="mdi-arrow-expand" size="md" color="blue-9" class="absolute-top-left" 
            @mouseenter="mouseenter($event)" @mouseleave="iconMouseleave()" />  -->
         <item-liked :item="item" class="absolute-bottom-right"/>   
      </q-img>
      <q-img v-if="mouseover" :src="image.url" :placeholder-src="image.thumbUrl" 
         class="z-top image-popup contain" :style="popupStyle" basic />
   </div>
</template>  

<script>
   import { SessionMgr } from 'src/managers/SessionMgr'	
	
	export default {
      props: ['item', 'image', 'hImageWidth', 'vImageWidth', 'imageMaxHeight', 'mouseContainer', 'tagId'], 
      data() {
	  		return {
            mouseleaveTime: 0,
            mouseover: false,
            mouse: { x: 0, y: 0},
            page:  { w: 0, h: 0 }
			}
		},
		computed: {
         thumbWidth() { return parseInt(this.image.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         thumbWH() { return "width: " + this.thumbWidth + "px; max-height: " + this.imageMaxHeight + "px;"},	
         popupStyle() { 
            // console.log("popupStyle", this.mouse, this.page)
            const popupWidth = this.image.isHorizontal ? 500 : 350
            let xPos = this.mouse.x + 75 + popupWidth < this.page.w ? 
               this.mouse.x + 75 : // x pos to right of cursor if space
               this.mouse.x - 20 - popupWidth  // or to left with room for popup
            
            const yPct = this.mouse.y * 100 / this.page.h // rough % down the page
            const avgThumbH = parseInt(this.hImageWidth) // avg thumb height is width of horz image
            let yPos = 0  
            if (yPct < 25) { yPos = this.mouse.y } // top 1/4 - position top of popup at cursor 
            else if (yPct < 50) { yPos = this.mouse.y - 50 } // 2nd - popup slightly above cursor
            // else if (yPct < 75) { yPos = this.mouse.y - avgThumbH/2 - 20 } // 3rd - popup centered at cursor
            else { yPos = this.page.h - avgThumbH - 150 } // bottom - popup completely visible

            if (xPos < 0) { // handle corner case of small screen
               xPos = 10 // popup should not start off of page
               yPos = this.mouse.y + 20 // popup needs to not overlap mouse
            }

            return  "width: " + popupWidth +  "px; left: " + xPos + "px; top: " + yPos + "px;"
         },
      },
      methods: {
         navToItemPage() { 
            if (SessionMgr.isCategory(SessionMgr.getDisplayItemsDesc())) { SessionMgr.setCategoryTag(this.tagId) }
            const dropParam = this.item.dropId ? "/" + this.item.dropId : "" 
            this.$router.push("/item/" + this.item.id + dropParam) 
         },
         mouseenter(event) {
            // console.log("mouseenter", event)
            this.mouse = { x: event.x, y: event.y }
            this.page  = { w: event.view.innerWidth, h: event.view.innerHeight }
            
            const mouseenterTime = Date.now()
            setTimeout(() => {  // debounce mouseover 
               if (mouseenterTime > this.mouseleaveTime ) { this.mouseover = true }
            }, 250)  
         },
         mouseleave() { 
            this.mouseleaveTime = Date.now()
            this.mouseover = false 
         },
         // iconMouseleave() { this.mouseleaveTime = Date.now() },
         // imageMouseleave() { this.mouseover = false }
      },
      components: {
			'item-liked' : require('components/Item/ItemLiked.vue').default,
      }
	}
</script>

<style>
   .image-popup {
      position: fixed;
		border: 5px solid; 
	}
</style>



