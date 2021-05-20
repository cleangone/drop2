<template>
   <q-editor v-model="container[field]" min-height="5rem" :dense="$q.screen.lt.md"
      :toolbar="[
         [
            {  label: $q.lang.editor.formatting,
               icon: $q.iconSet.editor.formatting,
               list: 'no-icons',
               options: ['p', 'h4', 'h5', 'h6', 'code']
            },
            {  icon: $q.iconSet.editor.align,
               fixedLabel: true,
               list: 'only-icons',
               options: ['left', 'center', 'right', 'justify']
            }
         ],
         ['bold', 'italic', 'strike', 'underline'],
         ['token', 'hr', 'link', 'custom_btn'],
         [
            {   label: $q.lang.editor.defaultFont,
               icon: $q.iconSet.editor.font,
               fixedIcon: true,
               list: 'no-icons',
               options: ['default_font', 'arial', 'courier_new', 'times_new_roman']
            },
            {  icon: $q.iconSet.editor.fontSize,
               fixedIcon: true,
               list: 'no-icons',
               options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6']
            },
            'removeFormat'
         ],
         ['unordered', 'ordered', 'outdent', 'indent'],
         ['viewsource']
      ]"
      :fonts="{ arial: 'Arial', courier_new: 'Courier New', times_new_roman: 'Times New Roman' }" 
   />
</template>

<script>
	export default {
      props: ['container', 'field']
   }
</script>
