import { SessionStorage } from 'quasar'
import { Route } from 'src/utils/Constants'
   
export class SessionMgr {   
   static get(key) { return SessionStorage.getItem(key) }
   static set(key, value) { 
      SessionStorage.set(key, value)
      return value 
   }
   
   static getDisplayItems()      { return SessionMgr.get('DisplayItems') }
   static setDisplayItems(value) { return SessionMgr.set('DisplayItems', value) }
   
   static tagDisplayItemsKey(tagId) { return 'TagDisplayItems' + tagId }
   static getTagDisplayItems(tagId) { return SessionMgr.get(SessionMgr.tagDisplayItemsKey(tagId)) }
   static setTagDisplayItems(tagId, items) { SessionMgr.set(SessionMgr.tagDisplayItemsKey(tagId), items) }
   
   // specify target tag within a category
   static getCategoryTag()   { return SessionMgr.get('CategoryTag')}
   static setCategoryTag(id) { SessionMgr.set('CategoryTag', id) }
   
   static setHomeItemsDesc()             { SessionMgr.setDisplayItemsDesc({ route: Route.HOME,      name: Route.HOME }) }
   static setDropItemsDesc(name, id)     { SessionMgr.setDisplayItemsDesc({ route: Route.DROP,      name: name, id: id }) }
   static setCategoryItemsDesc(name, id) { SessionMgr.setDisplayItemsDesc({ route: Route.CATEGORY,  name: name, id: id }) }
   static setRecentItemsDesc()           { SessionMgr.setRouteItemsDesc(Route.RECENT) }
   static setCurrentDesc()               { SessionMgr.setRouteItemsDesc(Route.CURRENT) }
   static setActivityDesc()              { SessionMgr.setRouteItemsDesc(Route.ACTIVITY) }
   static setFavoriteItemsDesc()         { SessionMgr.setRouteItemsDesc(Route.FAVORITE) }
   static setRouteItemsDesc(route)       { SessionMgr.setDisplayItemsDesc({ route: route, name: route }) }
   
   static getDisplayItemsDesc()     { return SessionMgr.get('DisplayItemsDesc')}
   static setDisplayItemsDesc(desc) { return SessionMgr.set('DisplayItemsDesc', desc)}
   
   static isHome(displayItemsDesc)      { return displayItemsDesc.route == Route.HOME }
   static isDrop(displayItemsDesc)      { return displayItemsDesc.route == Route.DROP }
   static isCategory(displayItemsDesc)  { return displayItemsDesc.route == Route.CATEGORY }
   static isRecent(displayItemsDesc)    { return displayItemsDesc.route == Route.RECENT }
   static isCurrent(displayItemsDesc)   { return displayItemsDesc.route == Route.CURRENT }
   static isActivity(displayItemsDesc)  { return displayItemsDesc.route == Route.ACTIVITY }
   static isFavorite(displayItemsDesc)  { return displayItemsDesc.route == Route.FAVORITE }
}
