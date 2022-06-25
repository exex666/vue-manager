<template>
  <div class="pageNum">
      <span class="count">共{{count}}条</span>
      <div class="iconfont icon-115fangxiang_xiangzuo noSelectPage" @click="pageLeft()"></div>
      <div :class="selectPageIndex==1 ? 'selectPage':'noSelectPage'"  @click="pageSelect(1)">
        1
      </div>
      <div class="noSelectPage" v-show="selectPageIndex-3>1">...</div>
      <template v-if="totalPage+1>1">
        <div :class="selectPageIndex==index ? 'selectPage':'noSelectPage'" v-for="index in middle " :key="index"  @click="pageSelect(index)">
        {{index}}
        </div>
      </template>
      <div class="noSelectPage" v-show="selectPageIndex+3<totalPage">...</div>
      <div :class="selectPageIndex==totalPage ? 'selectPage':'noSelectPage'"  @click="pageSelect(totalPage)">
        {{totalPage}}
      </div>
      <div class="iconfont icon-113fangxiang_xiangyou noSelectPage"  @click="pageRight()"></div>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  props: {
    totalPage: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectPageIndex: 1,
    }
  },
  computed: {
    middle() {
      const arr = []
      let index = this.selectPageIndex + 2 >= this.totalPage ? this.totalPage - 5 : this.selectPageIndex - 2
      for (; arr.length < 5 && index < this.totalPage; index++) {
        if (index > 1) { arr.push(index) }
      }
      return arr
    },
  },
  mounted() {

  },
  watch: {
    selectPageIndex(newVal) {
      this.$emit('pagechange', { value: newVal, })
    },
  },
  methods: {
    pageSelect(index) {
      this.selectPageIndex = index
    },
    pageLeft() {
      this.selectPageIndex--
      if (this.selectPageIndex < 1) this.selectPageIndex = 1
    },
    pageRight() {
      this.selectPageIndex++
      if (this.selectPageIndex > this.totalPage) this.selectPageIndex = this.totalPage
    },
  },
}
</script>

<style lang="scss" scoped>
  .pageNum {
    width: auto;
    height: 28px;
    line-height: 28px;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    %pageItem {
      box-sizing: border-box;
      padding: 0 8px;
      cursor: pointer;
      user-select: none;
    }
    .selectPage {
      @extend %pageItem;
      background-color: #20A0FF;
      border: 1px solid #20A0FF;
      color: #fff;
      cursor: default;
    }
    .noSelectPage {
      @extend %pageItem;
      border: 1px solid #D1DBE5;
      background-color: #fff;
      &:hover {
        background-color: #cbcbcb;
      }
    }
    .count {
      margin: 0 10px;
    }
    .iconfont {
      font-size: 12px;
      font-weight: bold;
    }
  }
</style>
