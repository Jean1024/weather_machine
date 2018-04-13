<template>
    <div class="tools">
        <h4>工具栏</h4>
        <div class="font">
            <label for="font">字体</label>
            <Select v-model="font.fontFamily" style="width:100px" size="small" @on-change="changeFF">
                <Option v-for="item in font.fontFamilys" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="font.fontSize" style="width:100px" size="small" @on-change="changeFZ">
                <Option v-for="item in font.fontSizes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <ColorPicker size="small" v-model="font.color" @on-change="changeColor" alpha />
        </div>
        <div class="text">
            <label for="subtitle">背景色</label>
            <ColorPicker size="small" v-model="font.backgroudColor" @on-change="changeBg" alpha />
        </div>
        <div class="text" style="overflow:hidden;">
            <label for="subtitle" class="left">背景图</label>
            <UploadImage class="left"></UploadImage>
        </div>
        <div class="text">
            <label for="subtitle">字幕</label>
            <Button icon="ios-plus-empty" type="dashed" size="small" @click="addLabel">添加标签</Button>
        </div>
        <div class="background">
            <label for="subtitle">底图</label>
            <Select v-model="background.place" style="width:100px" size="small" @on-change="changeMapBg">
                <Option v-for="item in background.places" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <ColorPicker size="small" v-model="background.color" alpha @on-change="changeMapFillColor"/>
        </div>
        <!-- <div class="text">
            <label for="subtitle">图标</label>
            <Button icon="ios-plus-empty" type="dashed" size="small">添加图标</Button>
        </div> -->
    </div>
</template>

<script>
import UploadImage from "../Public/UploadImage";
export default {
  components: { UploadImage },
  data() {
    return {
      font: {
        fontFamilys: [
          {
            value: "宋体",
            label: "宋体"
          },
          {
            value: "微软雅黑",
            label: "微软雅黑"
          },
          {
            value: "楷体",
            label: "楷体"
          }
        ],
        fontFamily: "楷体",
        fontSizes: [
          {
            value: "16px",
            label: "16号"
          },
          {
            value: "24px",
            label: "18号"
          },
          {
            value: "30px",
            label: "20号"
          }
        ],
        fontSize: "24px",
        color: "rgba(25, 190,107, 1)",
        backgroudColor: "rgba(25, 190,107, 1)"
      },
      background: {
        places: [
          {
            value: "http://61.4.184.177:7799/data/map/china.json",
            label: "中国"
          },
          {
            value: "http://61.4.184.177:7799/data/map/shang_hai.json",
            label: "上海"
          },
          {
            value: "http://61.4.184.177:7799/data/map/yun_nan.json",
            label: "云南"
          },
          {
            value: "http://61.4.184.177:7799/data/map/nei_meng_gu.json",
            label: "内蒙古"
          },
          {
            value: "http://61.4.184.177:7799/data/map/bei_jing.json",
            label: "北京"
          },
          {
            value: "http://61.4.184.177:7799/data/map/tai_wan.json",
            label: "台湾"
          },
          {
            value: "http://61.4.184.177:7799/data/map/ji_lin.json",
            label: "吉林"
          },
          {
            value: "http://61.4.184.177:7799/data/map/si_chuan.json",
            label: "四川"
          },
          {
            value: "http://61.4.184.177:7799/data/map/tian_jin.json",
            label: "天津"
          },
          {
            value: "http://61.4.184.177:7799/data/map/ning_xia.json",
            label: "宁夏"
          },
          {
            value: "http://61.4.184.177:7799/data/map/an_hui.json",
            label: "安徽"
          },
          {
            value: "http://61.4.184.177:7799/data/map/shan_dong.json",
            label: "山东"
          },
          {
            value: "http://61.4.184.177:7799/data/map/shan_xi.json",
            label: "山西"
          },
          {
            value: "http://61.4.184.177:7799/data/map/guang_dong.json",
            label: "广东"
          },
          {
            value: "http://61.4.184.177:7799/data/map/guang_xi.json",
            label: "广西"
          },
          {
            value: "http://61.4.184.177:7799/data/map/xin_jiang.json",
            label: "新疆"
          },
          {
            value: "http://61.4.184.177:7799/data/map/jiang_su.json",
            label: "江苏"
          },
          {
            value: "http://61.4.184.177:7799/data/map/jiang_xi.json",
            label: "江西"
          },
          {
            value: "http://61.4.184.177:7799/data/map/he_bei.json",
            label: "河北"
          },
          {
            value: "http://61.4.184.177:7799/data/map/he_nan.json",
            label: "河南"
          },
          {
            value: "http://61.4.184.177:7799/data/map/zhe_jiang.json",
            label: "浙江"
          },
          {
            value: "http://61.4.184.177:7799/data/map/hai_nan.json",
            label: "海南"
          },
          {
            value: "http://61.4.184.177:7799/data/map/hu_bei.json",
            label: "湖北"
          },
          {
            value: "http://61.4.184.177:7799/data/map/hu_nan.json",
            label: "湖南"
          },
          {
            value: "http://61.4.184.177:7799/data/map/ao_men.json",
            label: "澳门"
          },
          {
            value: "http://61.4.184.177:7799/data/map/gan_su.json",
            label: "甘肃"
          },
          {
            value: "http://61.4.184.177:7799/data/map/fu_jian.json",
            label: "福建"
          },
          {
            value: "http://61.4.184.177:7799/data/map/xi_cang.json",
            label: "西藏"
          },
          {
            value: "http://61.4.184.177:7799/data/map/gui_zhou.json",
            label: "贵州"
          },
          {
            value: "http://61.4.184.177:7799/data/map/liao_ning.json",
            label: "辽宁"
          },
          {
            value: "http://61.4.184.177:7799/data/map/zhong_qing.json",
            label: "重庆"
          },
          {
            value: "http://61.4.184.177:7799/data/map/shan_xi2.json",
            label: "陕西"
          },
          {
            value: "http://61.4.184.177:7799/data/map/qing_hai.json",
            label: "青海"
          },
          {
            value: "http://61.4.184.177:7799/data/map/xiang_gang.json",
            label: "香港"
          },
          {
            value: "http://61.4.184.177:7799/data/map/hei_long_jiang.json",
            label: "黑龙江"
          }
        ],
        place: "",
        color: "rgba(25, 190,107, 0)"
      }
    };
  },
  computed: {},
  methods: {
    addLabel() {
      this.$store.commit("ADD_LABEL", true);
    },
    changeFF(ff) {
      this.$store.commit("STYLE_CHANGE", { fontFamily: ff });
    },
    changeFZ(fz) {
      this.$store.commit("STYLE_CHANGE", { fontSize: fz });
    },
    changeColor(color) {
      this.$store.commit("STYLE_CHANGE", { color });
    },
    changeBg(bg) {
      this.$store.commit("STYLE_CHANGE", { backgroundColor: bg });
    },
    changeMapBg(bg) {
      this.$store.commit("MAP_STYLE_CHANGE", { place: bg });
    },
    changeMapFillColor(bg) {
      this.$store.commit("MAP_STYLE_CHANGE", { fillColor: bg });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.tools {
  width: 56rem;
  border: 1px solid #000;
  margin: 0.25rem;
  padding: 0.5rem;
  text-align: left;
  min-height: 14rem;
  h4 {
    text-align: left;
    margin-bottom: 0.5rem;
  }
  .font {
    label {
      margin-right: 1rem;
    }
  }
  .text {
    label {
      margin-right: 1rem;
    }
  }
  .background {
    label {
      margin-right: 1rem;
    }
  }
}
.tools > div {
  margin-bottom: 0.4rem;
}
</style>