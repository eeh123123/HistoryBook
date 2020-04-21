<template>
	<iframe :src="mapUrl" frameborder="0" class="full"></iframe>
</template>

<style>
	.full {
		height: 100%;
		width: 100%;
	}
</style>

<script>
	module.exports = {
		data: function() {
			return {
				mapUrl:'map.html'
			};
		},
		mounted() {

		},
		methods: {

		}
	};
</script>