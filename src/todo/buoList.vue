<template>
	<div class="full">
		<div class="floor1 margin-left10 margin-top10">
			<div>
				花色:
				<el-select v-model="flowerValue" filterable clearable placeholder="请选择" @change="queryCatData()">
					<el-option v-for="item in flowerList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>

			<div>
				面具：
				<el-select v-model="maskValue" filterable clearable placeholder="请选择" @change="queryCatData()">
					<el-option v-for="item in maskList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div>
				山猫纹：
				<el-select v-model="leopardValue" filterable clearable placeholder="请选择" @change="queryCatData()">
					<el-option v-for="item in leopardList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>

		</div>
		<div class="floor2">
			<div class="catWindow" v-for="(item, index) in catWindow" :key="index">
				<el-tooltip class="item" effect="dark" :content="getInfo(item)" placement="bottom" :effect="'light'">
			  	<el-image :src="item.imgUrl" lazy></el-image>
				</el-tooltip>
				<div style="text-align: center;height: 18px;line-height: 18px;">{{item.name}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				catWindow: [],
				flowerList: [],
				maskList: [],
				leopardList: [{
					label: "全部",
					value: ''
				}, {
					label: "有",
					value: '1'
				}, {
					label: "无",
					value: '0'
				}],
				leopardValue: '',
				flowerValue: '',
				maskValue: '',
			}
		},
		mounted() {
			this.setSelect()
			this.queryCatData()
		},
		methods: {
			getInfo(item) {
				let dct_enums_Array = JSON.parse(localStorage.getItem("dct_enums"))
				for(let j = 0; j < dct_enums_Array.length; j++) {
					if(dct_enums_Array[j].id == item.F_From ) {
							return "来源："+dct_enums_Array[j].F_MC+ ";主人：" + (item.fromUrl||'')
					}
				}
			},
			queryCatData() {
				let option = {
					tablename: "buocat",
					showcol: ["*"],
					sqlwhere: " 1=1"
				}
				if(this.flowerValue) {
					option.sqlwhere += " and flowercolor='" + this.flowerValue + "'"
				}
				if(this.maskValue) {
					option.sqlwhere += " and mask='" + this.maskValue + "'"
				}
				if(this.leopardValue) {
					option.sqlwhere += " and leopard='" + this.leopardValue + "'"
				}
				option.sqlwhere += " order by imgUrl desc"
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(res => {
						this.catWindow = res.data.data
					})
			},
			setSelect() {
				let dct_enums_Array = JSON.parse(localStorage.getItem("dct_enums"))
				for(let j = 0; j < dct_enums_Array.length; j++) {
					if(dct_enums_Array[j].F_T3 == '02') {
						this.flowerList.push({
							label: dct_enums_Array[j].F_MC,
							value: dct_enums_Array[j].id
						})
					} else if(dct_enums_Array[j].F_T3 == '03') {
						this.maskList.push({
							label: dct_enums_Array[j].F_MC,
							value: dct_enums_Array[j].id
						})
					}
				}
			}
		},
	}
</script>

<style scoped="scoped" lang="less">
	.floor1 {
		overflow: hidden;
		>div {
			float: left;
			margin-left: 10px;
		}
	}
	
	.floor2 {
		display: flex;
		flex-wrap: wrap;
		.catWindow {
			border: 1px solid #f5f5f5;
			border-radius: 3px;
			margin: 10px;
			width: calc(20% - 20px);
		}
	}
</style>