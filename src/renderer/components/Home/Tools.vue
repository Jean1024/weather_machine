<template>
    <div class="tools">
        <h4>工具栏</h4>
        <div class="font">
            <label for="font">字体</label>
            <Select v-model="font.fontFamily" style="width:100px" size="small">
                <Option v-for="item in font.fontFamilys" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="font.fontSize" style="width:100px" size="small">
                <Option v-for="item in font.fontSizes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <ColorPicker size="small" v-model="font.color" alpha />
        </div>
        <div class="text">
            <label for="subtitle">字幕</label>
            <Button icon="ios-plus-empty" type="dashed" size="small" @click="addLabel">添加标签</Button>
        </div>
        <div class="background">
            <label for="subtitle">底图</label>
            <Select v-model="background.place" style="width:100px" size="small">
                <Option v-for="item in background.places" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            
            <Select v-model="background.color" style="width:100px" size="small">
                <Option v-for="item in background.colors" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        <div class="text">
            <label for="subtitle">图标</label>
            <Button icon="ios-plus-empty" type="dashed" size="small">添加图标</Button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{ 
                font:{
                    fontFamilys: [
                        {
                            value: '宋体',
                            label: '宋体'
                        },
                        {
                            value: '微软雅黑',
                            label: '微软雅黑'
                        },
                        {
                            value: '楷体',
                            label: '楷体'
                        },
                    ],
                    fontFamily: '楷体',
                    fontSizes: [
                        {
                            value: '16',
                            label: '16号'
                        },
                        {
                            value: '18',
                            label: '18号'
                        },
                        {
                            value: '20',
                            label: '20号'
                        },
                    ],
                    fontSize: '18',
                    color: 'rgba(25, 190,107, 1)'
                },
                background:{
                    places:[
                        {
                            value: '北京市',
                            label: '北京市'
                        },
                        {
                            value: '天津市',
                            label: '天津市'
                        },
                        {
                            value: '河北省',
                            label: '河北省'
                        },
                    ],
                    colors:[
                        {
                            value: '深蓝',
                            label: '深蓝'
                        },
                        {
                            value: '浅黄',
                            label: '浅黄'
                        },

                    ],
                    color: '深蓝',
                    place: '天津市'
                }
            }
        },
        methods:{
            addLabel(){
                this.$store.commit("ADD_LABEL",true)
            }
        },
        mounted(){
        }
    }
</script>

<style scoped lang="less">
    .tools{
        width: 56rem;
        border: 1px solid #000;
        margin: .25rem;
        padding: 0.5rem;
        text-align: left;
        min-height: 14rem;
        h4{
            text-align: left;
            margin-bottom: 0.5rem;
        }
        .font{
            label{
                margin-right: 1rem;
            }
        }
        .text{
            label{
                margin-right: 1rem;
            }
        }
        .background{
            label{
                margin-right: 1rem;
            }
        }
    }
    .tools>div{
        margin-bottom: 0.4rem;
    }
</style>