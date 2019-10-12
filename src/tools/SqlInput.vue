<template>
	<div>
		<el-input suffix-icon="el-icon-circle-plus" @click.native="openSqlWindow()" v-model="value"><span>{{value}}</span>
		</el-input>
	</div>
</template>

<script>
	let vm;
	const mapState = Vuex.mapState;
	export default {
		computed: {
			getValue() {
				return this.$store.state.Dialog_CallBack
			},
		},
		data() {
			return {
				data: "",
				dialog: false,
				selectTable: {},
				editShow: false
			}
		},
		mounted() {
			vm = this;
			if(vm.type === "old") {

			}
			vm.value
		},
		props: {
			option: Object,
			value: String
		},
		methods: {
			openSqlWindow() {
				if(vm.type === "old") {
					vm.editShow = true;
				}
			},
			save() {
				this.closeEditDialog()
			},
			closeEditDialog() {
				this.editShow = false
			}
		},
		watch: {
			"option.editShow": {
				handler(newName, oldName) {
				}
			},
			getValue: function() {
				vm.value = vm.$store.state.Dialog_CallBack
			}
		}
	}
</script>

<style lang="css">
	.dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(0, -50%);
	}
</style>