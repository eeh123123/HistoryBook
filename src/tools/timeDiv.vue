<template>
	<el-date-picker v-model="currentTime" type="date" editable value-format="yyyyMMdd" class="timeDiv">
	</el-date-picker>
</template>

<script>
	export default {
		computed: {
			 currentTime: {
				 get: function() {
					return this.$store.state.currentTime
				},
				 set: function(val) {
				 	this.$store.commit("setcurrentTime", val);
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>
<style lang="less">
	.timeDiv {
		position: absolute;
		right: 20px;
		top: 5px;
		z-index: 99;
	}
</style>