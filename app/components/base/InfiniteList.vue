<style lang="less">
@import "../style/import.less";
.loading-spinner {
    position: relative;
    height: 1.5rem;
    text-align: center;
    /*font-size: 0.444444rem;*/
    .font-dpr(16px);
    line-height: 1.5rem;
    &:before {
      content: '';
      display: inline-block;
      width: 0.666667rem;
      height: 0.666667rem;
      background: url('~images/loading-spin.svg');
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: .25rem;
    }
}
</style>
<template>
  <div class="infinite-list-container">
    <slot></slot>
    <div class="loading-spinner" v-show="isLoading">正在加载..</div>
  </div>
</template>
<script>
  // var spinnerMapping = {
  //   bubbles: 'loading-bubbles',
  //   circles: 'loading-circles',
  //   default: 'loading-default',
  //   spiral: 'loading-spiral',
  //   waveDots: 'loading-wave-dots',
  // };
  /**
   * get the first scroll parent of an element
   * @param  {DOM} elm    the element which find scorll parent
   * @return {DOM}        the first scroll parent
   */
  function getScrollParent(elm) {
    if (elm.tagName === 'BODY') {
      return window;
    } else if (['scroll', 'auto'].indexOf(getComputedStyle(elm).overflowY) > -1) {
      return elm;
    }
    return getScrollParent(elm.parentNode);
  }

  /**
   * get current distance from footer
   * @param  {DOM} elm    scroll element
   * @param  {String} dir   calculate direction
   * @return {Number}     distance
   */
  function getCurrentDistance(elm, dir) {
    var distance;
    var scrollTop = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop;
    if (dir === 'top') {
      distance = scrollTop;
    } else {
      var styles = getComputedStyle(elm === window ? document.body : elm);
      var innerHeight = elm === window
                        ? window.innerHeight
                        : parseInt(styles.height, 10);
      var scrollHeight = elm === window
                         ? document.body.scrollHeight
                         : elm.scrollHeight;
      var paddingTop = parseInt(styles.paddingTop, 10);
      var paddingBottom = parseInt(styles.paddingBottom, 10);
      distance = scrollHeight - innerHeight - scrollTop - paddingTop - paddingBottom;
    }
    return distance;
  }

  export default {
    name: 'InfiniteList',
    data: function() {
      return {
        scrollParent: null,
        scrollHandler: null,
        isLoading: false,
      };
    },
    props: {
      distance: {
        type: Number,
        default: 100,
      },
      onInfinite: Function,
      direction: {
        type: String,
        default: 'bottom',
      },
    },
    mounted: function() {
      this.scrollParent = getScrollParent(this.$el);
      this.scrollHandler = function scrollHandlerOriginal() {
        if (!this.isLoading) {
          this.tryLoad();
        }
      }.bind(this);
      //setTimeout(this.scrollHandler, 1);
      this.scrollParent.addEventListener('scroll', this.scrollHandler);
      this.$on('$InfiniteLoading:loaded', function() {
        this.isLoading = false;
        // if (this.isLoading) {
        //   this.$nextTick(this.tryLoad);
        // }
      });
      this.$on('$InfiniteLoading:complete', function() {
        this.isLoading = false;
        this.scrollParent.removeEventListener('scroll', this.scrollHandler);
      });
      this.$on('$InfiniteLoading:reset', function() {
        this.isLoading = false;
        this.scrollParent.addEventListener('scroll', this.scrollHandler);
        //setTimeout(this.scrollHandler, 1);
      });
    },
    methods: {
      tryLoad: function() {
        var currentDistance = getCurrentDistance(this.scrollParent, this.direction);
        if (currentDistance <= this.distance) {
          this.isLoading = true;
          this.onInfinite.call();
        } else {
          this.isLoading = false;
        }
      },
    },
    destroyed: function() {
      if (!this.isComplete) {
        this.scrollParent.removeEventListener('scroll', this.scrollHandler);
      }
    },
  };
</script>