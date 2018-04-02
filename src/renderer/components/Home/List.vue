<template>
    <div class="lists">
        <h2>播出列表</h2>
        <ul>
            <li class="item" v-for="(item,index) of imgs" :key="index">
                <div class="index">
                    {{index}}
                </div>
                <div class="pic">
                    <img :src="item.img" alt="">
                </div>
                <div class="options">
                    <div>
                        <Select v-model="options.mode" style="width:100px" size="small">
                            <Option v-for="item in options.modes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <CheckboxGroup v-model="options.modeStatus" class="checkList">
                            <Checkbox label="xiguo"></Checkbox>
                        </CheckboxGroup>
                    </div>
                    <div>
                        <Button type="ghost" size="small">跳过</Button> 
                        <CheckboxGroup v-model="options.modeStatus" class="checkList">
                            <Checkbox label="sdf"></Checkbox>
                        </CheckboxGroup>
                    </div>       
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
            }
        },
        computed:{
            imgs(){
                return this.$store.state.Preview.imgs.data
            }
        }
    }
</script>

<style scoped lang="less">
    .lists{
        width: 24rem;
        border: 1px solid #000;
        min-height: 30rem;
        margin: 0.25rem;
        padding: 0.5rem;
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
                    }
                }
                .options{
                    .checkList{
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>