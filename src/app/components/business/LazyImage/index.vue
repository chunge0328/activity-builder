<style>
    .lazy-img {
        min-height: 20px;
        background-color: #e5e5e5;
    }
</style>
<template>
    <div class="lazy-img"><img/></div>
</template>
<script>
    export default {
        name: 'LazyImage',
        props: {
			src: {
				type: String,
				$rule: { name: '图片' }
			}
		}
    }
</script>