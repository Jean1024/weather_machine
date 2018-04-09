<template>
    <div class="preview" id="pdf">
        <span class="crop" @click="crop">{{tip}}</span>
        <div id="map"></div>
    </div>
</template>

<script>
    const baseUrl = 'https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    import TOOLS from '../../tools/util'
    import fs from 'fs'
    export default {
        data(){
            return {
                tip: '保存',
                msg: 'Lorem',
                box: {}
            }
        },
        computed:{
            // 地图图层数据
            num(){
                const _this = this
                const data = this.$store.state.ResourceList.main.data
                return data
            },
            // 地图数据存储位置
            mydata(){
                return this.$store.state.ResourceList.main.dataUrl
            }
        },
        watch: {
            // 监听图层数据变化
            num (newCount, oldCount) {
                const _this = this
               if( _this.group){
                    _this.group.eachLayer(layer=>{
                        _this.group.removeLayer(layer)
                    })
                    TOOLS.draw(_this.map,_this.group,newCount)
               }
            },
            // 监听本地文件地址变化
            mydata(newData, oldData){
                const _this = this
                _this.$store.dispatch("refreshMap",{map:_this.map,url:newData})
            }
        },
        methods:{
            crop(){
                const _this = this
                // 开始照相
                TOOLS.shoot(_this.box,(mypath)=>{
                    // 存储照片成功后 ==》 存储当前屏幕数据
                    const data = _this.$store.state.ResourceList.main.data
                    const center = _this.map.getCenter()
                    const zoom = _this.map.getZoom()
                    const result = {
                        data,
                        map:{
                            center,
                            zoom
                        }
                    }
                    // 写入数据
                    fs.writeFile(mypath,JSON.stringify(result),(err,res)=>{
                        if(err) console.log(err)
                    })
                    // 刷新图片列表
                    this.$store.dispatch("refreshIMGS")
                })
            }
        },
        mounted(){
            // 初始化地图
            const _this = this
            const ele = document.querySelector('.preview')
            const DPR = window.devicePixelRatio
            _this.map = L.map('map').setView([39.9042, 116.4], 5);
            _this.group = L.layerGroup()
            L.tileLayer(baseUrl).addTo(_this.map);
            // 获取预览窗口大小和位置，为采取图片准备
            this.box = {
                x: ele.offsetLeft*DPR,
                y: ele.offsetTop*DPR,
                width: ele.clientWidth*DPR,
                height: ele.clientHeight*DPR
            }
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