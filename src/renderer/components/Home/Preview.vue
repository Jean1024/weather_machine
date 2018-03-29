<template>
    <div class="preview">
        <span class="crop">页面截取</span>
        <!-- <v-map :zoom=13 :center="[47.413220, -1.219482]">
            <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
            <v-marker :lat-lng="[47.413220, -1.219482]"></v-marker>
        </v-map> -->
    </div>
</template>

<script>
    export default {
        data(){
            return {
                msg: 'Lorem'
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
    }
</style>