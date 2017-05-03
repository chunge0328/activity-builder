<template>
	<div ref="scrollView">
		<slot></slot>
	</div>
</template>
<script>
	import Vue from 'vue';
	import IScroll from 'iscroll/build/iscroll-lite.js';
	export default {
	  name: 'IScrollView',
	  props: {
	    options: {
	      type: Object,
	      default: function() {}
	    }
	  },
	  methods: {
	    _registPullEvents: function() {
	      var iscroll = this.iscroll;
	      var context = this;
	      iscroll.on('scrollEnd', function(e) {
	        if (iscroll.y <= iscroll.maxScrollY) {
	          context.$emit('pullUp', iscroll)
	        } else if (iscroll.y >= 0) {
	          context.$emit('pullDown', iscroll)
	        }
	      })
	    },
	    scrollToElement: function() {
	      this.$nextTick(()=> this.iscroll.scrollToElement.apply(this.iscroll, arguments))
	    },
	    scrollBy: function() {
	      this.$nextTick(()=> this.iscroll.scrollBy.apply(this.iscroll, arguments))
	    },
	    scrollTo: function(){
	      this.$nextTick(()=> this.iscroll.scrollTo.apply(this.iscroll, arguments))
	    },
	    refresh: function(){
	      this.$nextTick(()=> this.iscroll.refresh.apply(this.iscroll, arguments))
	    }
	  },
	  beforeDestroy: function() {
	    this.iscroll && this.iscroll.destroy()
	    this.iscroll = null
	  },
	  mounted: function() {
	    var events = [
	      'beforeScrollStart',
	      'scrollCancel',
	      'scrollStart',
	      'scrollEnd',
	      'scroll'
	    ];
	    this.$nextTick(function() {
	      var context = this;
	      context.iscroll = new IScroll(this.$refs.scrollView, this.options);
	      events.forEach(function(event) {
	        context.iscroll.on(event, function() {
	        	context.$emit(event, context.iscroll)
	        })
	      })
	      context._registPullEvents();
	    })
	  }
	}
</script>