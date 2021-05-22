/*
   tag
      id 
      name
      category
      sortName
*/

export class TagMgr {   
   static hasTag(container, tagId) { 
      if (container.tags) {
         for (var tag of container.tags) {
            if (tag.id == tagId) { return true }
         }
      }

      return false
   }
   
   static getId(container, category) { 
      if (!container.tagIds) { return "" }
      return container.tagIds[category] ? container.tagIds[category] : ""
   }
   
   static setTag(container, tag) { 
      if (!container.tagIds) { container.tagIds = {} }
      container.tagIds[tag.category] = tag.id
      
      if (!container.tagNames) { container.tagNames = {} }
      container.tagNames[tag.category] = tag.name
   }

   static getNameToTagMap(tags) { 
      let tagMap = new Map()
      for (var tag of tags) {
         tagMap.set(tag.name, tag)
      }
      return tagMap
   }

   static getNames(tags) { 
      const sortedTags = Array.from(tags)
      sortedTags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
   
      let names = []
      for (var tag of sortedTags ) {
         names.push(tag.name)
      }
      return names
   }

   static getTagIds(tags) { 
      let tagIds = new Set()
      if (tags) {
         for (var tag of tags) {
            tagIds.add(tag.id)
         }
      }
      return tagIds
   }

   static getTagIdArray(tags) { return Array.from(TagMgr.getTagIds(tags)) }

   static getTagNameArray(tags) { 
      let names = []
      if (tags) {
         for (var tag of tags) {
            names.push(tag.name)
         }
      }
      return names 
   }

   static getTags(uiTags) { 
      if (!uiTags) { return [] }

      const tags = []
      for (var uiTag of uiTags) {
         tags.push({ id: uiTag.value, name: uiTag.label, sortName: uiTag.sortName })         
      }
      return tags
   }

   static getUiTags(tags) { 
      if (!tags) { return [] }

      const uiTags = []
      for (var tag of tags) {
         uiTags.push({ label: tag.name, value: tag.id, sortName: tag.sortName }) 
      }
      return uiTags
   }

   static sortUiTags(uiTags) { 
      const sortedTags = Array.from(uiTags)
      sortedTags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
      return sortedTags
   }
}
