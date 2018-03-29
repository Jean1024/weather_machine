<template>
    <div class="resource">
        <h4>资源列表</h4>
        <ul class="title">
            <li v-for="item of menu" @click="tab(item)">{{item.title}}</li>
        </ul>
        <ul class="info">
            <li v-for="item of current">{{item}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                menu:[
                    {
                        title: '降水降温类',
                        arr: ["降水实况","温度实况","相对温度实况","降水预报","气温预报","分钟级降水","全国气压"]
                    },
                    {
                        title: '雷达云图类',
                        arr: ["降水实况","温度实况","相对温度实况",]
                    },
                    {
                        title: '空气质量类',
                        arr: ["降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况",]
                    },
                    {
                        title: '预警及实景类',
                        arr: ["降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况","降水实况","温度实况","相对温度实况",]
                    },
                ],
                current:[]
            }
        },
        methods:{
            tab(item){
                this.current = item.arr
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
            }
        }
    }
</style>