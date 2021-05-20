import { firebaseStorage } from 'boot/firebase'

export class StorageMgr {         
   static deleteItemsFiles(items) { 
      if (!items) { return }
      for (var item of items) {
         StorageMgr.deleteItemFiles(item)
      }
   }
   
   static deleteItemFiles(item) { 
      if (!item) { return }
      if (item.primaryImage) { StorageMgr.deleteImageFiles(item.primaryImage) }
      if (item.images) {
         for (var image of item.images) { StorageMgr.deleteImageFiles(image) }
      }
   }

   static deleteImageFiles(image) { 
      if (!image) { return }
      let files = []
      if (image.filePath) { files.push(image.filePath) }
      if (image.thumbFilePath) { files.push(image.thumbFilePath) }

      StorageMgr.deleteFiles(files)
   }

   static deleteFiles(files) { 
      const storageRef = firebaseStorage.ref()
      for (var file of files) {
         console.log("Deleting file " + file)
         storageRef.child(file).delete()
         .catch(function(error) {
            console.log("Error deleting file " + file, error)
         })
      }
   }
}
