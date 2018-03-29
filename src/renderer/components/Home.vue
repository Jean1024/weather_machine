<template>
  <div class="container">
    <ResourceList class="left"></ResourceList>
    <Tools class="left"></Tools>
    <List class="left"></List>
    <Preview class="left"></Preview>
  </div>
</template>

<script>
  import ResourceList from './Home/ResourceList'
  import Tools from './Home/Tools'
  import List from './Home/List'
  import Preview from './Home/Preview'
  export default {
	  components:{ResourceList,Tools,List,Preview},
    data(){
      return{
        
      }
    }
  }
</script>

<style scoped lang="less">
</style>