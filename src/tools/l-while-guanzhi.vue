<template>
	<ul v-if="item.children && item.children.length > 0 && item.closed==true">
		<template v-for="children in item.children">
			<child :text="item">
				<span class="verticalWord" @click="clickFunc(children)" @contextmenu.prevent="guanzhiDrawer(children)">
				<el-tooltip class="item" effect="dark" :content="children.pinjie_F_MC"  placement="bottom" :effect="'light'">
					<span class="verticalWord">{{children.GuanZhi_MC}}</span>
				</el-tooltip>
				</span>
				<l-while :item="children">
				</l-while>
			</child>
		</template>
	</ul>
</template>
<script>
	import child from './l-child.vue'
	export default {
		name: 'l-while',
		components: {
			child
		},
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		methods: {
			clickFunc(children) {
				children.closed = !children.closed
			},
			guanzhiDrawer(children) {
				this.$store.commit("setguanzhiDrawer", true);
				this.$store.commit("setguanzhiData", children);
			},
		}
	}
</script>