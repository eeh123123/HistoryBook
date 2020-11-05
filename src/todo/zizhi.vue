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
				value: '',
				textarea: '',
			}
		},
		methods: {
			zhuanhuan() {
				let event = []
				let event_mx = []

				let data = this.value.split("    ")
				let date
				for(let j = 0; j < data.length; j++) {
					if(j % 2 == 0) {
						date = data[j].slice(0, 10).split("-")
						event.push({
							caption: data[j].slice(10),
							year: date[0] - 0,
							month: date[1] - 0,
							Time: date[0] + date[1] + date[2],
							bookValue: 24,
							title: ''
						})
					} else {
						if(data[j].search("【】") != -1) {
							event_mx.push({
								caption: data[j],
								GuWen: data[j - 1].slice(10),
								year: date[0] - 0,
								month: date[1] - 0,
								Time: date[0] + date[1] + date[2],
								bookValue: 24,
								title: '',
								JingQue: 0
							})
						} else {
							event_mx.push({
								caption: data[j].replace(/【】/g,""),
								GuWen: data[j - 1].slice(10).replace(/【】/g,""),
								year: date[0] - 0,
								month: date[1] - 0,
								Time: date[0] + date[1] + date[2],
								bookValue: 24,
								title: '',
								JingQue: 1
							})
						}
						if(j == data.length - 1) {
							break
						}
					}
				}
				axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
						params: {
							tablename: "event",
							Insertcol: "caption,year,month,Time,bookValue",
							values: event
						}
					})
					.then(res => {
						this.$message({
							type: 'success',
							message: res.data.msg
						});
					})
				axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
						params: {
							tablename: "event_mx",
							Insertcol: "caption,year,month,Time,bookValue",
							values: event_mx
						}
					})
					.then(res => {
						this.$message({
							type: 'success',
							message: res.data.msg
						});
					})
				//				data = data.replace("-","");
				//				data = data.replace(")","");
				//				data = data.replace("）","");
				//				data = data.replace("(","（");
				//				let arr = data.split("（")
				//				let str0 = arr[0]
				//				let str1 = arr[1].slice(0,3)
				//				let str2 = arr[1].slice(3,6)
				//				this.textarea = str0+"	"+str1+"	"+str2
			}
		},
	}
</script>

<style lang="scss">

</style>