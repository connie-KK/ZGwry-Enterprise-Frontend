<template>
  <div class="uploadBox">
    <input
      type="file"
      accept="image/*"
      name="file"
      id="myfile"
      @change="changeData(this)"
    />
    <ul>
      <li v-for="(item, index) in myData" :key="index + 'llist'">
        <img :src="item.url" @click="$emit('clickimg', index)" />
        <span @click="deleteItem(item)" v-if="showDelete">×</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'uploadBox',
  props: {
    data: {
      type: [Array, Boolean],
      default: () => {
        return []
      }
    },
    // 提前预览
    autoShow: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    initt: {
      type: String,
      default: 'none'
    }
  },
  data() {
    return {
      myData: this.data
    }
  },
  watch: {},
  mounted() {},
  methods: {
    addItem() {
      if (this.initt === 'dingding') {
        this.uploadImg()
      } else {
        window.myfile.click()
      }
    },
    changeData() {
      let files = document.getElementById('myfile').files
      this.$emit('upload', files)
      if (this.autoShow) {
        for (let i = 0; i < files.length; i++) {
          let reads = new FileReader()
          reads.readAsDataURL(files[i])
          reads.onload = e => {
            this.myData.push({
              url: e.currentTarget.result
            })
          }
        }
      }
    },
    async uploadImg() {
      let imgs = await window.dingtalk.chooseImage({
        count: 5
      })
      this.$emit('upload', imgs.filePaths)
    },
    deleteItem(data) {
      this.$emit('deleteItem', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadBox {
  #myfile {
    display: none;
  }
  ul {
    li {
      width: 1.3rem;
      height: 1.3rem;
      margin-right: 0.5rem;
      margin-bottom: 0.2rem;
      position: relative;
      float: left;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      span {
        position: absolute;
        height: 0.3rem;
        width: 0.3rem;
        font-size: 0.28rem;
        line-height: 0.35rem;
        color: #fff;
        right: -0.15rem;
        top: -0.15rem;
        background: #aaaaaa;
        border-radius: 50%;
        text-align: center;
      }
    }
  }
}
</style>
