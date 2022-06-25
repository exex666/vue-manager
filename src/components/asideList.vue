<template>
  <div class="list">
    <div class="item" @click="navTo(option[0].url)">
      <div class="itemTitle">
        <span :class="['icon', 'iconfont', 'icon-shouyetianchong']"></span>
        首页
      </div>
    </div>
    <div class="item" v-for="(item, index) in option.slice(1)" :key="index+1" >
      <div class="itemTitle" @click="expand(index+1)">
        <span :class="['icon', 'iconfont', item.icon]"></span>
        {{ item.title }}
        <span :class="['up','iconfont','icon-fangxiangshang',{'icon-fangxiangxia':item.expand}]" ></span>
      </div>
      <div :class="['unfold',{ fold: !item.expand }]" :style="`height: ${item.list.length * 50}px;`">
        <div class="contentItem" v-for="(content,index) in item.list" :key="index" @click="navTo(content.url)">
          {{content.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsideList',
  props: {
    option: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    }
  },

  mounted() {},

  methods: {
    expand(index) {
      this.option[index].expand = !this.option[index].expand
    },
    navTo(url) {
      this.$router.push(url)
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #324157;
  color: #bfcbd9;
  font-size: 14px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .item {
    cursor: pointer;
    .itemTitle {
      width: 100%;
      height: 56px;
      line-height: 56px;
      padding-left: 30px;
      position: relative;
      &:hover {
      background-color: #47576a;
    }
      .icon {
        font-size: 16px;
        margin-right: 5px;
        vertical-align: bottom;
      }
      .up,
      .down {
        position: absolute;
        font-size: 18px;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .unfold {
      width: 100%;
      transition: height ease-out 0.3s;
      overflow: hidden;
      .contentItem {
        padding-left: 50px;
        height: 50px;
        background-color: #1F2D3D;
        line-height: 56px;
      }
    }
    .fold {
      height: 0 !important;
      overflow: hidden;
    }
  }
}
</style>
