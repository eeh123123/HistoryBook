<template>
	<div class="baseTable">
		<el-table tooltip-effect="light" :data.sync="tableData.data" :height.sync="tableHeight" @current-change="selectedTableData" highlight-current-row>
			<el-table-column v-for="(item, index) in tableHead" :value="item.code" :key="index" :show-overflow-tooltip="true" :prop="item.code" :label="item.label" align="center" :width="item.code == 'index' ? 50 : item.width" :min-width="item['min-width']">
				<template slot-scope="scope">
					<span v-if="item.code == 'index'">{{(currentPage - 1) * pageSize + (scope.$index + 1)}}</span>
					<el-button v-else-if="item.type == 'btn'" @click="item.func(scope.row)" type="text" size="small">
						{{ scope.row[item.code]}}
					</el-button>
					<div v-else-if="item.type == 'btnArray'">
						<el-button v-for="(item1, index) in item.func" :key="index" @click="item1(scope.row)" type="text" size="small">
							{{ scope.row[item.code][index] }}
						</el-button>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'input'">
						<el-input v-model="scope.row[item.code]"></el-input>
					</div>
					<div v-else-if="item.type == 'template'"></div>
					<div v-else-if="item.COL_APP_TYPE == 'date'">
						<el-date-picker v-model="scope.row[item.code]" type="date" editable value-format="yyyy-MM-dd">
						</el-date-picker>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'window'">
						<el-input suffix-icon="el-icon-circle-plus" @click.native="open_Dialog(scope.$index, scope.row)" v-model="scope.row[item.code + '_F_MC']">
						</el-input>
						<!--<span>{{scope.row[item.code+"_F_BH"]}}</span>-->
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'icon'">
						<img :src="scope.row[item.code]" @click="openImg(scope.$index,scope.row[item.code],item.code)" style="vertical-align: middle;height:40px;width: 40px" />
					</div>
					<span v-else>{{ scope.row[item.code] }}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" class="hi-pagination-1" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" background layout="total, prev, pager, next" :total="tableData.total" :current-page.sync="currentPage">
		</el-pagination>
		<el-dialog title="选择图片" :visible.sync="Img.Visible" :close-on-click-modal="false" v-dialogDrag custom-class="dialog-Image">
			<el-upload class="avatar-uploader" :action="Img.action" :show-file-list="false" :on-success="handleAvatarSuccess">
				<img v-if="Img.Url" :src="Img.Url" class="person-Image" />
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-dialog>
		<el-dialog title="Dialog.title" :visible.sync="Dialog.Visible" :close-on-click-modal="false" v-dialogDrag custom-class="dialog-Image">
			<el-upload class="avatar-uploader" :action="Img.action" :show-file-list="false" :on-success="handleAvatarSuccess">
				<img v-if="Img.Url" :src="Img.Url" class="person-Image" />
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		computed: {
			init: function() {}
		},
		created() {},
		data() {
			return {
				currentRow: null,
				currentPage: 1,
				Img: {
					Visible: false,
					Url: '',
					action: ''
				},
				contentId: '', //当前行的id,
				contentUrl: '', //当前行的imgURL
				F_PKEY: '', //当前字典的主键
				Dialog: {
					Visible: false,
					title: ''
				}
			};
		},
		methods: {
			getF_PKEY() {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: "DCT_DICTS",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + this.$route.query.dctid + "'"
					}
				}).then(res => {
					this.F_PKEY = res.data.data[0].DCT_FID
				})
			},
			selectedTableData(val) {
				this.currentRow = val;
				this.$emit("selectedTableData", val);
			},
			open_Dialog(index, item) {},
			openImg(index, val, colName) {
				this.contentId = this.tableData.data[index].id; //这里要获取一下主键
				this.contentUrl = colName
				this.Img.Visible = true;
				this.Img.Url = val;
				this.Img.action = "http://49.235.128.250:8084/up";
			},
			handleAvatarSuccess(res, file) {
				this.Img.Url = this.$store.state.FWQURL + "upload/" + res.filename;
				let array_update = [{}];
				array_update[0][this.F_PKEY] = this.contentId
				array_update[0][this.contentUrl] = this.Img.Url
				axios.post(this.$store.state.MYURL + "UpdateTableRow.do", {
					params: {
						tablename: this.$route.query.dctid,
						values: array_update
					}
				}).then(res => {
					this.tableData.data[this.contentId - 1][this.contentUrl] = this.Img.Url;
					this.$message({
						type: "success",
						message: res.data.msg
					});
				})
			}
		},
		mounted() {
			this.getF_PKEY()
		},
		props: {
			tableData: Object,
			tableHead: Array,
			tableHeight: Number,
			pageSize: {
				type: [String, Number],
				default: 10
			},
			handleCurrentChange: Function
		}
	};
</script>