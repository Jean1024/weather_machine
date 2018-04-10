<template>
    <div class="preview" id="pdf">
        <span class="crop" @click="crop">{{tip}}</span>
        <div id="map"></div>
        <img v-if="current.legend" :src="current.legend" alt="无法显示" class="legend">
        <div class="time" v-if="num.t">
            <h3>{{current.info}}</h3>
            <p v-if="current.type === 1">{{num.t | formatDate}}</p>
        </div>
        <Deformation v-for="(item,index) in labels" v-if="item.show" :key="index" @close="item.show = false" class="mylabel" :w="100" :h="100" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true" @dblclick="item.show = true">
            <p>请输入内容</p>
        </Deformation>
    </div>
</template>

<script>
    const baseUrl = 'https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    import TOOLS from '../../tools/util'
    import Deformation from '../Public/deformation'
    import fs from 'fs'
    export default {
        components:{Deformation},
        data(){
            return {
                myhtml: '<h3>123</h3>',
                tip: '保存',
                msg: 'Lorem',
                box: {},
                labels:[]
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
            },
            // 当前地图数据
            current(){
                return this.$store.state.ResourceList.current
            },
            // 添加label状态
            labelStatus(){
                return this.$store.state.ResourceList.main.addLabel
            },
            editor() {
                return this.$refs.myQuillEditor.quill
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
            },
            // 监听label状态
            labelStatus(newData,oldData){
                const _this = this
                if(newData){
                    // 添加一个标签
                    _this.labels.push({
                        id: Date.now(),
                        html: "",
                        show: true,
                        style: {
                            width: '200px',
                            height: '50px',
                            top: '300px',
                            left: '300px'
                        }
                    })
                    _this.$store.commit('ADD_LABEL',false)
                }
            }
        },
        filters: {
            formatDate: function (t) {
                return TOOLS.formatT(t)
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
                            zoom,
                        },
                        legends:_this.current
                    }
                    // 写入数据
                    fs.writeFile(mypath,JSON.stringify(result),(err,res)=>{
                        if(err) console.log(err)
                    })
                    // 刷新图片列表
                    this.$store.dispatch("refreshIMGS")
                })
            },
            onResize: function (x, y, width, height) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
            },
            onDrag: function (x, y) {
                this.x = x
                this.y = y
            },
        },
        mounted(){
            // 初始化地图
            const _this = this
            const ele = document.querySelector('.preview')
            const DPR = window.devicePixelRatio
            _this.map = L.map('map').setView([35.38, 112.24], 4);
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

<style lang="less">
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
        .legend{
            width: 24rem;
            position: absolute;
            right: 0rem;
            bottom: 0rem;
            z-index: 888;
        }
        .time{
            position: absolute;
            top: 0;
            right: 0;
            z-index: 888;
            width: 20rem;
            height:4rem;
            background: url('../../assets/images/jt_pic_tit1.png') no-repeat center/contain;
            h3{
                color: rgb(0, 0, 73);
                height: 2.6rem;
                line-height: 2.6rem;
                font-size: 1.2rem;
                padding-right: 0.5rem;
                font-family: 微软雅黑;
                font-weight: 700;
                text-align: right;
            }
            p{
                color: white;
                text-align: right;
                font-size: 0.8rem;
                height: 1.4rem;
                line-height: 1.4rem;
                padding-right: 0.5rem; 
            }
        }
        ul{
            li{
                position: absolute;
                box-sizing: border-box;
                width: 10rem;
                height: 2rem;
                line-height: 2rem;
                top: 50%;
                left: 50%;
                z-index: 1000;
                background: pink;
                padding: 0;
                margin: 0;
                border: 1px solid #000;
                cursor: move;
                input{
                    box-sizing: border-box;
                    padding-left: 0.5rem;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    border: 0 none;
                    outline: 0 none;
                }
            }
        }
        .mylabel{
            z-index: 1000;
        }  
        .superText{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 1002;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            // padding: 10rem;
            .editer_container{
                background: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 50%;
                height: 50%;
                overflow: hidden;
            }
            .control{
                position: absolute;
                top: 0;
                right: 0;
                padding-right: 0.2rem;
                z-index: 2;
                i{
                    cursor: pointer;
                }
            }
        }
    }
    
</style>