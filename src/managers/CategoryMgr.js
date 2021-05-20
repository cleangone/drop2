import { UI } from 'src/utils/Constants'

/*
   category
      id
      parentId: 0 for root categories
      name
      shortName
      sortName
      image { baseName, isHorizontal, url, filePath, thumbUrl, thumbFilePath }
*/

export const CategoryStatus = {
   PRIVATE:   'Private',
   PUBLIC:    'Public',
   AVAILABLE: 'Available',
}

export const CATEGORY_NONE = {id: "0", name: UI.NONE }

export class CategoryMgr {
   static categoryName(container) { return container.category ? container.category.name : "" }

   static isNone(category)   { return category.name == CATEGORY_NONE.name }
   static isPublic(category) { return category.status == CategoryStatus.PUBLIC }

   static slim(category) { return { id: category.id, name: category.name } }
   static slimAll(categories) {
      const slimCategories = []
      for (var category of categories) {
         slimCategories.push(CategoryMgr.slim(category)) 
      }
      return slimCategories
   }

   static categoryOptions(categories) {    
      const options = CategoryMgr.slimAll(categories)
      options.push(CATEGORY_NONE)
      return options
   }
}
