<template>
	<baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15" mapType="BMAP_SATELLITE_MAP" :scroll-wheel-zoom="true" ak="YOUR_APP_KEY">
	</baidu-map>
</template>

<script>
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	export default {
		components: {
			BaiduMap
		}
	}
</script>

<style lang="less">
	.map {
		width: 100%;
		height: 100%;
	}
</style>