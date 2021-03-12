<template>
	<div class="full" style="padding: 10px;">
		<el-input v-model="value" style="width:200px" @change="zhuanhuan"></el-input>
		<br>
		<el-button @click="zhuanhuan">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea">
		</el-input>

		简短逗号分隔的字符串
		<el-input v-model="value1" style="width:200px"></el-input>
		<br>
		<el-button @click="zhuanhuan1">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea1" style="margin-bottom:10px;">
		</el-input>

		<h3>输入文字模板：</h3> 一库房左侧一个，右侧两个，中间两个，密集架背面左侧两个，中间两个，右侧两个
		<br>
		<h3>点击转换按钮，你会得到：</h3>
		一库房左侧一个
		<br>右侧两个
		<br>中间两个
		<br>密集架背面左侧两个
		<br>中间两个
		<br>右侧两个<br>

		<el-input v-model="value2" style="width:200px；margin-top:10px"></el-input>
		<el-button @click="zhuanhuan2">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea2">
		</el-input>
	</div>
</template>

<script>
	export default {
		name: 'item-Data',
		data() {
			return {
				value: '',
				textarea: '',
				value1: '',
				textarea1: '',
				value2: '',
				textarea2: ''
			}
		},
		methods: {
			zhuanhuan() {
				let data = this.value.replace(/\s*/g, "");
				data = data.replace("-", "");
				data = data.replace("一", "");
				data = data.replace(")", "");
				data = data.replace("）", "");
				data = data.replace("(", "（");
				let arr = data.split("（")
				let str0 = arr[0]
				let str1 = arr[1].slice(0, 3)
				let str2 = arr[1].slice(3, 6)
				this.textarea = str0 + "	" + str1 + "	" + str2
			},
			zhuanhuan1() {
				let data = this.value1.replace(/\s*/g, "");
				data = data.replace("-", "");
				data = data.replace("一", "");
				data = data.replace(")", "");
				data = data.replace("）", "");
				data = data.replace("。", "");
				data = data.replace(new RegExp("、", "gm"), "\n");
				this.textarea1 = data
			},
			zhuanhuan2() {
				let data = this.value2.replace(/\s*/g, "");

				data = data.replace(new RegExp("，", "gm"), "\n");
				this.textarea2 = data
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	textarea {
		text-indent: 0px;
	}
</style>