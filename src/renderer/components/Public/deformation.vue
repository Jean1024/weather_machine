<template>
  <div class="vdr" :class="{ draggable, resizable, active , dragging, resizing}" 
      tabindex="0" 
      @mousedown="elmDown"
      @keydown.stop="keydown($event)" 
      :style="style">
    <!-- 如果可改变大小为真 -->
    <template v-if="resizable && !disable">
      <!-- 待优化 -->
      <div class="handle border"></div>
      <div class="handle handle-top"  ></div>
      <div class="handle handle-ml" @mousedown.stop.prevent="handleDown('ml')"></div>
      <div class="handle handle-mr" @mousedown.stop.prevent="handleDown('mr')"></div>
      <div class="handle handle-tm" @mousedown.stop.prevent="handleDown('tm')"></div>
      <div class="handle handle-bm" @mousedown.stop.prevent="handleDown('bm')"></div>
      <div class="handle handle-cl" @click.stop.prevent="close">
        <Icon type="android-close" size=24></Icon>
      </div>
      <div class="handle handle-br" @mousedown.stop.prevent="handleDown('br')">
        <svg version="1.1" id="&#x56FE;&#x5C42;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 700 700" style="enable-background:new 0 0 700 700;" xml:space="preserve">
          <g>
            <g>
              <defs>
                <rect id="SVGID_1_" x="16.92" y="17.4" width="666" height="666"/>
              </defs>
              <clipPath id="SVGID_2_">
                <use xlink:href="#SVGID_1_"  style="overflow:visible;"/>
              </clipPath>
              <path style="clip-path:url(#SVGID_2_);" d="M676.131,422.63c9.053-9.037,9.053-22.591,0-31.631l-4.525-4.518
                c-9.049-9.037-22.624-9.037-31.672,0L386.531,639.52c-9.049,9.037-9.049,22.595,0,31.631l4.525,4.518
                c9.05,9.037,22.624,9.037,31.676,0L676.131,422.63z M603.732,61.146c9.05-9.036,9.05-22.591,0-31.627L599.208,25
                c-9.05-9.041-22.624-9.041-31.677,0L24.528,567.225c-9.049,9.036-9.049,22.591,0,31.627l4.525,4.518
                c9.05,9.04,22.627,9.04,31.677,0L603.732,61.146z M639.934,241.89c9.049-9.037,9.049-22.595,0-31.631l-4.525-4.518
                c-9.054-9.037-22.628-9.037-31.677,0l-398.2,397.63c-9.053,9.04-9.053,22.595,0,31.631l4.525,4.518
                c9.05,9.037,22.624,9.037,31.673,0L639.934,241.89z M639.934,241.89"/>
            </g>
          </g>
        </svg>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    replace: true,
    name: 'deformation',
    data () {
      return {
        parentX: 0,
        parentW: 9999,
        parentY: 0,
        parentH: 9999,
        mouseX: 0,
        mouseY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        mouseOffX: 0,
        mouseOffY: 0,
        elmX: 0,
        elmY: 0,
        elmW: 0,
        elmH: 0
      }
    },
    props: {
      draggable: { // 是否可被拖动
        type: Boolean, default: true
      },
      resizable: { // 是否可改变大小
        type: Boolean, default: true
      },
      w: { // 宽度
        type: Number,
        default: 200,
        validator: (val) => {
          return (typeof val === 'number' && val > 0)
        }
      },
      h: { // 高度
        type: Number,
        default: 200,
        validator: (val) => {
          return (typeof val === 'number' && val > 0)
        }
      },
      minw: { // 最小宽度
        type: Number,
        default: 50,
        validator: function (val) {
          return val > 0
        }
      },
      minh: { // 最小高度
        type: Number,
        default: 20,
        validator: function (val) {
          return val > 0
        }
      },
      x: { // 距父元素左上角X轴偏移量
        type: Number,
        default: 0
      },
      y: { // 距父元素左上角Y轴偏移量
        type: Number,
        default: 0
      },
      zoom: {
        type: Number,
        default: 1
      },
      axis: { // 定义组件可以拖动的轴线
        type: String,
        default: 'both',
        validator: function (val) {
          return ['x', 'y', 'both'].indexOf(val) !== -1
        }
      },
      grid: {
        type: Array,
        default: () => {
          return [1, 1]
        }
      },
      restrain: { // 约束组件大小
        type: Number,
        default: 0
      },
      parent: {
        type: Boolean, default: false
      },
      disable: {
        type: Boolean, default: false
      }
    },
    mounted () {
      // 初始化控件宽高
      if (this.minw > this.w) this.width = this.minw
      if (this.minh > this.h) this.height = this.minh
      // 判断是否只能在父级元素中拖动
      if (this.parent) {
        this.parentW = parseInt(this.$el.parentNode.clientWidth, 10)
        this.parentH = parseInt(this.$el.parentNode.clientHeight, 10)

        if (this.w > this.parentW) this.width = this.parentW
        if (this.h > this.parentH) this.height = this.parentH
        if ((this.x + this.width) > this.parentW) this.left = parentW - this.width
        if ((this.y + this.height) > this.parentH) this.top = parentH - this.height
      }
      this.$emit('resizing', this.left, this.top, this.width, this.height)
    },
    data: function () {
      return {
        top: this.y,
        left: this.x,
        width: this.w,
        height: this.h,
        resizing: false,
        dragging: false,
        active: false,
        handle: null
      }
    },
    methods: {
      elmDown (e) { // 组件被按下事件
        // 阻止默认事件
        // e.preventDefault()
        // 判断是否支持键盘微调
        if (this.disable || !this.resizable) return
        const target = e.target || e.srcElement
        // 确保事件发生在组件内部
        if (this.$el.contains(target)) {
          if (!this.active) {
            this.lastMouseX = e.pageX || e.clientX + document.querySelector('#pdf').scrollLeft
            this.lastMouseY = e.pageY || e.clientY + document.querySelector('#pdf').scrollTop
            document.querySelector('#pdf').addEventListener('mousemove', this.handleMove, true)
            document.querySelector('#pdf').addEventListener('mousedown', this.deselect, true)
            document.querySelector('#pdf').addEventListener('mouseup', this.handleUp, true)
            this.active = true
            this.$emit('activated')
          }
          this.elmX = parseInt(this.$el.style.left)
          this.elmY = parseInt(this.$el.style.top)
          this.elmW = this.$el.offsetWidth || this.$el.clientWidth
          this.elmH = this.$el.offsetHeight || this.$el.clientHeight
          if (this.draggable) {
            this.dragging = true
          }
        }
      },
      deselect (e) { // 取消选择事件
        this.mouseX = e.pageX || e.clientX + document.querySelector('#pdf').scrollLeft
        this.mouseY = e.pageY || e.clientY + document.querySelector('#pdf').scrollTop
        this.lastMouseX = this.mouseX
        this.lastMouseY = this.mouseY
        
        const target = e.target || e.srcElement
        const regex = new RegExp('handle-([trmbl]{2})', '')
        if (!this.$el.contains(target) && !regex.test(target.className)) {
          if (this.active) {
            document.querySelector('#pdf').removeEventListener('mousemove', this.handleMove, true)
            document.querySelector('#pdf').removeEventListener('mousedown', this.deselect, true)
            document.querySelector('#pdf').removeEventListener('mouseup', this.handleUp, true)
            this.active = false
            this.$emit('deactivated')
          }
        }
      },
      handleDown (handle) { // 拖动点按下事件
        // 将handle设置为当前元素
        this.handle = handle
        this.resizing = true
      },
      handleMove (e) {
        this.mouseX = e.pageX || e.clientX + document.querySelector('#pdf').scrollLeft
        this.mouseY = e.pageY || e.clientY + document.querySelector('#pdf').scrollTop
        // diffX =  当前鼠标位置 - 上次鼠标位置 + ？？
        let diffX = (this.mouseX - this.lastMouseX + this.mouseOffX) / this.zoom
        let diffY = (this.mouseY - this.lastMouseY + this.mouseOffY) / this.zoom
        this.mouseOffX = this.mouseOffY = 0
        this.lastMouseX = this.mouseX
        this.lastMouseY = this.mouseY
        let dX = diffX
        let dY = diffY
        if (this.resizing) {
          if (this.handle.indexOf('t') >= 0) {
            if (this.elmH - dY < this.minh) this.mouseOffY = (dY - (diffY = this.elmH - this.minh))
            else if (this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
            this.elmY += diffY
            this.elmH -= diffY
          }
          if (this.handle.indexOf('b') >= 0) {
            if (this.elmH + dY < this.minh) this.mouseOffY = (dY - (diffY = this.minh - this.elmH))
            else if (this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
            this.elmH += diffY
          }
          if (this.handle.indexOf('l') >= 0) {
            if (this.elmW - dX < this.minw) this.mouseOffX = (dX - (diffX = this.elmW - this.minw))
            else if (this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
            this.elmX += diffX
            this.elmW -= diffX
          }
          if (this.handle.indexOf('r') >= 0) {
            if (this.elmW + dX < this.minw) this.mouseOffX = (dX - (diffX = this.minw - this.elmW))
            else if (this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
            this.elmW += diffX
          }
          this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
          this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
          this.width = (Math.round(this.elmW / this.grid[0]) * this.grid[0])
          this.height = (Math.round(this.elmH / this.grid[1]) * this.grid[1])
          this.$emit('resizing', this.left, this.top, this.width, this.height)
        } else if (this.dragging) {
          if (this.parent) {
            if (this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
            else if (this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
            if (this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
            else if (this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
          }
          this.elmX += diffX
          this.elmY += diffY
          if (this.axis === 'x' || this.axis === 'both') {
            this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
          }
          if (this.axis === 'y' || this.axis === 'both') {
            this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
          }
          this.$emit('dragging', this.left, this.top)
        }
      },
      getRestrain (num) {
        const restrain = this.restrain
        return (num / restrain).toFixed(0) * restrain
      },
      handleUp (e) {
        this.handle = null
        // 约束
        const restrain = this.restrain
        if (restrain && restrain > 0) {
          this.left = this.getRestrain(this.left)
          this.top = this.getRestrain(this.top)
          this.width = this.getRestrain(this.width)
          this.height = this.getRestrain(this.height)
        }
        if (this.resizing) {
          this.resizing = false
          this.$emit('resizestop', this.left, this.top, this.width, this.height)
        }
        if (this.dragging) {
          this.dragging = false
          this.$emit('dragstop', this.left, this.top)
        }
        this.elmX = this.left
        this.elmY = this.top
      },
      keydown (event) {
        // 判断是否支持键盘微调
        if (this.disable || !this.resizable) return
        // 微调位置
        switch (event.key) {
          case 'ArrowUp': this.top--; this.$emit('dragstop', this.left, this.top); break
          case 'ArrowLeft': this.left--; this.$emit('dragstop', this.left, this.top);  break
          case 'ArrowDown': this.top++; this.$emit('dragstop', this.left, this.top);  break
          case 'ArrowRight': this.left++; this.$emit('dragstop', this.left, this.top);  break
          default: this.$emit('keydown', event);
        }
      },
      close(){
        this.$emit('close')
      },
    },
    watch: {
      x (newVal) {
        this.left = newVal
      },
      y (newVal) {
        this.top = newVal
      },
      w (newVal) {
        this.width = newVal
      },
      h (newVal) {
        this.height = newVal
      }
    },
    computed: {
      style () {
        const w = this.width === 0? 'auto': this.width + 'px'
        const h = this.height === 0? 'auto': this.height + 'px'
        return {
          top: this.top + 'px',
          left: this.left + 'px',
          width: w,
          height: h
        }
      }
    }
  }
</script>

<style scoped>
  .vdr {
    position: absolute;
    user-select: none;
    /* background: #fff; */
  }
  .draggable:hover {
    cursor: move;
  }
  .handle {
    display: none;
    position: absolute;
    z-index: 999;
  }
  .border{
    /* z-index: -1; */
    width: 100%;
    height: 100%;
    border: 1px dashed #000;
    z-index: -1;
  }
  .handle-top{
    width: 100%;
    height: 20px;
    top: 0;
    left: 0;
    background: #000;
    transform: translateY(-100%);
  }
  svg {
    fill: darkslateblue;
  }
  .handle-br {
    bottom: 0;
    right: 0;
    cursor: se-resize;
    width: 25px;
    height: 25px;
    padding: 5px;
    background-color: white;
  }
 .handle-ml {
    top: 0;
    left: -5px;
    cursor: w-resize;
    position: absolute;
    height: 100%;
    width: 5px;
  }
  .handle-ml:hover {
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #3F51B5);
  }
  .handle-mr {
    top: 0;
    right: -5px;
    cursor: w-resize;
    position: absolute;
    height: 100%;
    width: 5px;
  }
  .handle-mr:hover {
    background: linear-gradient(to right, #3F51B5, rgba(255, 255, 255, 0));
  }
  .handle-tm {
    position: absolute;
    width: 100%;
    height: 5px;
    top: -5px;
    left: 0;
    cursor: n-resize;
  }
  .handle-tm:hover {
    background: linear-gradient(rgba(255, 255, 255, 0), #3F51B5);
  }
  .handle-bm {
    position: absolute;
    width: 100%;
    height: 5px;
    bottom: -5px;
    left: 0;
    cursor: s-resize;
  }
  .handle-bm:hover {
    background: linear-gradient(#3F51B5, rgba(255, 255, 255, 0));
  }
  .active .handle {
    display: block;
  }
  .handle-cl{
    position: absolute;
    top: 0;
    right: 0;
    color: #222;
    width: 20px;
    height: 20px;
  }
  .handle-cl:hover{
    cursor: pointer;

  }
  .icon {
    text-align: center;
    line-height: 25px;
    color: white;
    font-size: 22px;
    overflow: hidden;
  }
  textarea{
    background: rgba(0, 0, 0, 0);
    border: 0 none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 880;
    font-size: 1rem;
    font-family: 'Microsoft Yahei';
    border: 0 none;
  outline:0px none transparent;
  overflow: hidden;
  }
</style>
