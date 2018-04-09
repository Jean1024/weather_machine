<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    // 改变根子体大小，进行rem适配
    !function(win,doc){
        var d=doc.documentElement;
        function change(){
            win.fz = d.clientWidth/96
            d.style.fontSize= d.clientWidth/96+'px';
        }
        win.addEventListener('resize',change,false);
        change();
    }(window,document);
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f2f2f2;
  min-height: 100vh
}
li{
  list-style: none;
}
.left{
  float: left;
}
.right{
  float: right;
}
.leaflet-control-container{
    display: none;
}
</style>
