import { Config } from 'boot/Config'
   
/*
   image
     baseName, 
     isHorizontal, 
     url, 
     filePath, 
     thumbUrl, 
     thumbFilePath 
*/

export class ImageMgr {
   // note - image.thumbUrl set when stored - have to wait for file to be created by resize function
   static setFilePaths(image) {   
      // console.log("setFilePaths ", image)
      if (!image.baseName) { return logError("setFilePaths: baseName not set") }
      if (!image.url || !image.url.includes(image.baseName)) {
         return logError("setFilePaths: url does not contain baseName " + image.baseName, image.url)
      }

      let filePathPrefix = image.url
      filePathPrefix = filePathPrefix.substring(0, filePathPrefix.indexOf(image.baseName))            
      filePathPrefix = filePathPrefix.substring(filePathPrefix.lastIndexOf("/"))
      filePathPrefix = decodeURIComponent(filePathPrefix)
      // console.log("filePathPrefix", filePathPrefix)

      if (!filePathPrefix.startsWith(Config.STORAGE_DIR)) {
         return logError("setFilePaths: url file path does not start with directory path " + Config.STORAGE_DIR, filePathPrefix)
      }

      filePathPrefix = filePathPrefix.substring(1)
      image.filePath = filePathPrefix + image.baseName
      // console.log("imageFilePath ", item.imageFilePath)

      const baseExtension = image.baseName.substring(image.baseName.lastIndexOf("."))
      const baseFilename = image.baseName.substring(0, image.baseName.lastIndexOf(".")) 
      const thumbDimensions = "_" + Config.THUMBNAIL_DIMENSION + "x" + Config.THUMBNAIL_DIMENSION
      image.thumbFilePath = filePathPrefix + baseFilename + thumbDimensions + baseExtension
      // console.log("thumbFilePath ", item.thumbFilePath)
   }
}

function logError(msg, error = null) {
   if (error) { console.log(msg, error)}
   else { console.log(msg) }

   return null
}
