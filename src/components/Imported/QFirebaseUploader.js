import { QUploaderBase } from "quasar";
import { firebaseStorage } from "boot/firebase";

export default {
   name: "QFirebaseUploader",
   mixins: [QUploaderBase],
   props: {
     path: String
   },
 
   data() {
     return {
       uploading: false,
       uploadTasks: []
     };
   },
 
   computed: {
     // Required - working on uploading files
     isUploading() { return this.uploading },
 
     // Optional - shows overlay on top of uploader signaling it's waiting on something (blocks all controls)
     isBusy() { return this.uploading }
   },
 
   methods: {
     abort() {
       this.uploadFiles.forEach(uploadTask => { uploadTask.cancel() }) 
       this.uploading = false;
     },
     upload() {
       if (this.canUpload === false) { return }
 
       this.uploading = true
 
       this.files.forEach(file => {
         const datetime = new Date().toISOString().split(".")[0];
         const newRef = this.path + datetime + "_" + file.name;
         const uploadTask = firebaseStorage.ref(newRef).put(file);
 
         this.uploadTasks.push(uploadTask);
 
         uploadTask.on(
           "state_changed",
           snapshot => (this.uploadedSize += snapshot.bytesTransferred),
           error => console.log(error),
           () => {
             uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
               this.$emit("upload", { url: downloadURL, name: file.name } );
               this.removeFile(file);
               this.uploading = false
             });
 
             this.uploadedSize - this.uploadSize === 0 &&
               (this.uploading = false);
           }
         )
       })
     }
   }
 };