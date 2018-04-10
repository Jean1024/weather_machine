<template>
    <div class="lists">
        <div class="title">
            <h2 class="left">播出列表</h2>
            <div class="control right">
                <Button type="ghost" size="small" @click="output">全部导出</Button>
                <Button type="ghost" size="small" @click="lunbo">轮播</Button>
               <Button type="ghost" size="small" @click="refreshData">刷新数据</Button> 
            </div>
        </div>
        <ul>
            <li class="item" v-for="(item,index) of imgs" :key="index">
                <div class="index">
                    {{index + 1}}
                </div>
                <div class="pic" @click="backto(item.img)">
                    <img :src="item.img" alt="无法显示">
                </div>
                <div class="options">
                    <!-- <div>
                        <Select v-model="options.mode" style="width:100px" size="small">
                            <Option v-for="item in options.modes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div> -->
                    <div>
                        <Button type="ghost" size="small" @click="del(item.img)">删除</Button> 
                    </div>       
                </div>
            </li>
        </ul>
        <div class="carousel" v-if="showCarousel">
            <div class="close" @click="closeCarousel">x</div>
            <Carousel class="my_carousel" v-model="value1">
                <CarouselItem v-for="(item,index) of imgs" :key="index">
                    <div class="demo-carousel">
                        <img :src="item.img" alt="无法显示">
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <Modal
            v-model="modal1"
            title="温馨提示"
            @on-ok="ok"
            @on-cancel="cancel">
            <p>确定删除吗?</p>
        </Modal>
    </div>
</template>

<script>
    const fs =require('fs')
    const path = require("path")
    const url = require("url")
    export default {
        data(){
            return{
                tempData: '',
                modal1: false,
                value1: 0,
                showCarousel: false,
                options:{
                    modes: [
                        {
                            value: '联播',
                            label: '联播'
                        },
                    ],
                    mode: '联播',
                    modeStatus:[]
                },
                myImgs:[]
            }
        },
        computed:{
            // 获取本地文件架下保存的图片列表
            imgs(){
                // this.myImgs = this.$store.state.Preview.imgs.data
                return this.$store.state.Preview.imgs.data
            }
        },
        methods:{
            // 版本回退
            backto(item){
                const myurl = item.replace('.png','.json') + "?t=" + Date.now()
                this.$store.commit('CHANGE_DATA',myurl)
            },
            // 轮播图
            lunbo(){
                this.showCarousel = true
            },
            // 关闭轮播图
            closeCarousel(){
                this.showCarousel = false
            },
            output(){
                const _this = this
                const ipc = this.$electron.ipcRenderer
                ipc.send('open-file-dialog')     
                ipc.on('selected-directory', function (event, mypath) {
                    const _path = mypath[0]
                    _this.imgs.forEach(item=>{
                        fs.createReadStream(item.img.replace('file:///','')).pipe(fs.createWriteStream(path.join(_path,path.basename(item.img))));
                    })
                })
            },
            // 刷新数据
            refreshData(){
                this.$store.dispatch('refreshData')
            },
            // 删除版本
            del(item){
                this.modal1 = true
                this.tempData = item
            },
            // 确定删除
            ok () {
                this.$store.dispatch('delImg',this.tempData)
            },
            // 取消删除
            cancel () {
                
            }        
        }
    }
</script>

<style scoped lang="less">
    .lists{
        width: 24rem;
        border: 1px solid #000;
        height: 32rem;
        overflow: scroll;
        margin: 0.25rem;
        padding: 0.5rem;
        .title{
            overflow: hidden;
        }
        h2{
            text-align: left;
            margin-bottom: 0.5rem;
            font-size: 0.7rem;
        }
        ul{
            .item{
                height: 5rem;
                border: 1px solid #000;
                margin-top: -1px;
                padding: 0.5rem;
                .index{
                    float: left;
                    height: 4rem;
                    line-height: 4rem;
                    width: 3rem;
                    border: 1px solid #000;

                }
                .pic{
                    float: left;
                    width: 8rem;
                    height: 4rem;
                    background: #000;
                    margin-left: 1rem;
                    img{
                        max-height: 100%;
                        max-width: 100%;
                        cursor: pointer;
                    }
                }
                .options{
                    .checkList{
                        display: inline-block;
                    }
                }
            }
        }
        .carousel{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 5000;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .6);
            .close{
                position: absolute;
                top: 0rem;
                right: 1rem;
                color: #fff;
                font-size: 5rem;
                height: 4rem;
                line-height: 4rem;
                cursor: pointer;
                z-index: 1000;
            }
            .my_carousel{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 100%;
                height: 100%;
                .demo-carousel{
                    height: 100vh;
                    position: relative;
                    img{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        max-width: 100vw;
                        max-height: 100vh;
                    }
                }
            }
        }
    }
</style>