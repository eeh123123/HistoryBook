<template>
	<div class="full" style="padding: 10px;">
		<h1>处理唐代行政区划</h1>
		<h3>输入文字模板：</h3>
		下博县（618-907)<br>
		<h3>点击转换按钮，你会得到：</h3>
		下博县	618	907<br>
		<h3>这段文字可以直接粘贴入数据库。</h3>
		<el-input v-model="value" style="width:200px;margin-top: 10px;" @change="zhuanhuan"></el-input>
		<br>
		<el-button @click="zhuanhuan" style="margin-bottom:10px">转换</el-button>
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