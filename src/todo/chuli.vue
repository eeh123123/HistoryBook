<template>
	<div class="full" style="padding: 10px;">
		<el-input v-model="value" style="width:200px" @change="zhuanhuan"></el-input>
		<br>
		<el-button @click="zhuanhuan">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea">
		</el-input>
	</div>
</template>

<script>
	export default {
		name: 'item-Data',
		data() {
			return {
				value:'',
				textarea:''
			}
		},
		methods: {
			zhuanhuan(){
				let data = this.value.replace(/\s*/g,"");
				data = data.replace("-","");
				data = data.replace("一","");
				data = data.replace(")","");
				data = data.replace("）","");
				data = data.replace("(","（");
				let arr = data.split("（")
				let str0 = arr[0]
				let str1 = arr[1].slice(0,3)
				let str2 = arr[1].slice(3,6)
				this.textarea = str0+"	"+str1+"	"+str2
			}
		},
	}
</script>

<style lang="scss">

</style>