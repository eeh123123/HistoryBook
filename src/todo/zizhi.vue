<template>
	<div class="full" style="padding: 10px;">
		<h2>处理资治通鉴</h2>
		<el-input v-model="value" style="width:200px" @change="zhuanhuan"></el-input>
		<br>
		<el-button @click="zhuanhuan">转换</el-button>
		<br>
		<h2>处理隋书:</h2>
		<el-input v-model="value1" style="width:200px"></el-input>
		<br>
		<el-button @click="zhuanhuan1">转换</el-button>
	</div>
</template>

<script>
	export default {
		name: 'item-Data',
		data() {
			return {
				value: '',
				value1: ''
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
								caption: data[j].replace(/【】/g, ""),
								GuWen: data[j - 1].slice(10).replace(/【】/g, ""),
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
			},

			zhuanhuan1() {
				let event = []
				let event_mx = []

				let data = this.value1.split("  ")
				var date = ""
				var year, month, day
				for(var i = 0; i < data.length; i++) {
					date = data[i].slice(0, 8)
					year = date.slice(0, 4)
					month = date.slice(4, 6) + ""
					day = date.slice(6, 8) + ""
					event.push({
						caption: data[i].slice(8),
						year: year-0,
						month: month-0,
						Time: year + month + day,
						bookValue: 24,
						title: data[i].slice(10).replace("，","")
					})
					event_mx.push({
						caption: '',
						GuWen: data[i].slice(8),
						year: year-0,
						month: month-0,
						Time: year + month + day,
						bookValue: 68,
						title: '',
						JingQue: 1
					})
				}
				axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
						params: {
							tablename: "event",
							Insertcol: "caption,year,month,Time,bookValue,title",
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

			}
		}
	}
</script>

<style lang="scss">

</style>