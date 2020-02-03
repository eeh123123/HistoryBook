<template>
	<ul v-if="item.children && item.children.length > 0 && item.closed==true">
		<template v-for="children in item.children">
			<child :text="item">
				<span class="child-item" @click="clickFunc(children)" @click.right="userDrawer(children)" >
					<span class="person" :style="{'background-image':'url(' + children.imgURL + ')'}"></span>
				<span class="name">{{children.person_name}}</span>
				</span>
				<l-while :item="children">
				</l-while>
			</child>
		</template>
	</ul>
</template>
<script>import child from './l-child.vue'
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
		userDrawer(children) {
			this.$store.commit("setDrawer", true);
		}
	}
}</script>