<template>
    <div class="preview" id="pdf">
        <span class="crop" @click="crop">{{tip}}</span>
        <div id="map"></div>
    </div>
</template>

<script>
    const baseUrl = 'http://61.4.184.177:10088/{z}/{x}/{y}'
    import TOOLS from '../../tools/util'
    export default {
        data(){
            return {
                tip: '截屏',
                msg: 'Lorem',
            }
        },
        computed:{
            num(){
                const _this = this
                const data = this.$store.state.ResourceList.main.data
                return data
            }
        },
        watch: {
            num (newCount, oldCount) {
                const _this = this
                _this.group.eachLayer(layer=>{
                    _this.group.removeLayer(layer)
                })

                TOOLS.draw(_this.map,_this.group,newCount)
            }
        },
        methods:{
            crop(){
                TOOLS.shoot(()=>{
                    this.$store.dispatch("refreshIMGS")
                })
            }
        },
        mounted(){
            const _this = this
            _this.map = L.map('map').setView([39.9042, 116.4], 5);
            _this.group = L.layerGroup()
            L.tileLayer(baseUrl).addTo(_this.map);
        }
    }
</script>

<style scoped lang="less">
    .preview{
        width: 68rem;
        height: 32rem;
        background: pink;
        position: relative;
        .crop{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%,-100%);
            z-index: 666;
            padding: 0.2rem;
            background: #eee;
            border: 1px solid #666;
            border-radius: 0.5rem;
            cursor: pointer;
        }
        #map{
            height: 100%;
        }
    }
</style>