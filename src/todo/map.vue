<template>
	<div class="amap-page-container">
		<el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
		</el-amap>

		<div class="toolbar">
			<button @click="getMap()">get map</button>
		</div>
	</div>
</template>

<style>
	.amap-demo {
		height: 300px;
	}
	
	.amap-page-container {
		height: 100%;
		widows: 100%;
	}
</style>

<script>
	// NPM 方式
	// import { AMapManager } from 'vue-amap';
	// CDN 方式
	let amapManager = new VueAMap.AMapManager();
	module.exports = {
		data: function() {
			return {
				amapManager,
				zoom: 12,
				center: [121.59996, 31.197646],
				events: {
					init: (o) => {
						console.log(o.getCenter())
						console.log(this.$refs.map.$$getInstance())
						o.getCity(result => {
							console.log(result)
						})
					},
					'moveend': () => {},
					'zoomchange': () => {},
					'click': (e) => {
						alert('map clicked');
					}
				},
				plugin: ['ToolBar', {
					pName: 'MapType',
					defaultType: 0,
					events: {
						init(o) {
							console.log(o);
						}
					}
				}]
			};
		},
		mounted() {
			window.VueAMap.initAMapApiLoader({
				key: 'fd8cd8fa7308dcd486921150f5e67e30',
				plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
				v: '1.4.4'
			});
		},
		methods: {
			getMap() {
				// amap vue component
				console.log(amapManager._componentMap);
				// gaode map instance
				console.log(amapManager._map);
			}
		}
	};
</script>