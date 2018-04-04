<template>
    <div class="resource">
        <h4>资源列表</h4>
        <ul class="title">
            <li v-for="(item,index) of menu" @click="tab(item)" :key="index">{{item.title}}</li>
        </ul>
        <ul class="info">
            <li v-for="(item,index) of current" :key="index" @click="changeData(item)">{{item.name}}</li>
        </ul>
        <Spin class="mask" size="large" fix v-if="showMask"></Spin>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                menu:[
                    {
                        title: '降水降温类',
                        arr: [
                            {
                                name:"降水实况",
                                api: 'js_sk',
                                url: 'https://decisionappjson.tianqi.cn/js_data/china/precipitation1h.json',
                            },
                            {
                                name:"温度实况",
                                api: 'wd_sk',
                                url: 'https://decisionappjson.tianqi.cn/js_data/china/balltemp.json'
                            },
                            {
                                name:"气温预报",
                                api: 'qw_yb',
                                url: 'http://decision-171.tianqi.cn/outdata/china/YB024-wdmax.json'

                            },
                            ]
                    },
                    // {
                    //     title: '雷达云图类',
                    //     arr: ["降水实况","温度实况","相对温度实况",]
                    // },
                    // {
                    //     title: '空气质量类',
                    //     arr: ["降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况",]
                    // },
                    // {
                    //     title: '预警及实景类',
                    //     arr: ["降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况",]
                    // },
                ],
                current:[]
            }
        },
        computed:{
            showMask(){
                return this.$store.state.ResourceList.main.showMask
            }
        },
        methods:{
            tab(item){
                this.current = item.arr
            },
            changeData(data){
                this.$store.dispatch('someAsyncTask',{data})
            }
        },
        mounted(){
            this.current = this.menu[0]['arr']
        }
    }
</script>

<style scoped lang="less">
    .resource{
        width: 36rem;
        border: 1px solid #000;
        margin: .25rem;
        padding: 0.5rem;
        min-height: 14rem;
        h4{
            text-align: left;
            margin-bottom: 0.5rem;
        }
        .title{
            border-bottom: 1px solid #000;
            overflow: hidden;
            padding-bottom: 0.5rem;
            li{
                float: left;
                margin-right: 0.5rem;
                border: 1px solid #666;
                font-size: .8rem;
                padding: 0.2rem 0.4rem;
                border-radius: 0.3rem;
                cursor: pointer;
            }
        }
        .info{
            overflow: hidden;
            li{
                float: left;
                margin-right: 1rem;
                margin-top: 1rem;
                height: 2.4rem;
                padding: 0 1rem;
                border-radius: 0.3rem;
                border: 1px solid #000;
                background: pink;
                font-size: 0.8rem;
                line-height: 2.4rem;
                cursor: pointer;
            }
        }
        .mask{
            z-index: 10008;
        }
    }
</style>