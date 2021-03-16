<template>
	<div class="full">
		<el-select v-model="chaodai" clearable filterable class="margin-left10 chaodaiSelect" placeholder="选择朝代" @change="changeIframe()">
			<el-option v-for="item in chaodaiOptions" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<component v-bind:is="currentView" ref="child"></component>
	</div>
</template>

<script>
	import beizhou from '../sonVue/1.vue'
	export default {
		data() {
			return {
				chaodai: 1,
				chaodaiOptions: [{
					name: '隋',
					id: 0
				}, {
					name: '北周',
					id: 1
				}, {
					name: '唐',
					id: 2
				}, {
					name: '陈',
					id: 3

				}]
			};
		},
		computed: {
			currentTime: function() {
				return this.$store.state.currentTime
			},
			currentView() {
				if(this.chaodai == 1) {
					return beizhou
				}
			}
		},
		methods: {
			changeIframe() {
				
//				document.getElementById("sonIframe").src = "../../static/" + this.chaodai + ".html"
//				var _this = this
//				document.getElementById("sonIframe").onload = function() {
//					document.getElementById('sonIframe').contentWindow.QueryGaoGuan(_this.$store.state.MYURL, _this.currentTime.replace(/-/g, ''))
//				};
				
			}
		},
		mounted() {
				this.$refs.child.QueryGaoGuan(this.$store.state.MYURL, this.currentTime.replace(/-/g, ''));
		},
		watch: {
			currentTime: function() {
				this.$refs.child.QueryGaoGuan(this.$store.state.MYURL, this.currentTime.replace(/-/g, ''));
			},
		}
	}
</script>

<style scoped="scoped">
	.chaodaiSelect {
		width: 150px;
		margin: 5px 0 5px 5px;
	}
	
	iframe {
		height: calc(100% - 50px);
		width: 100%;
	}
</style>