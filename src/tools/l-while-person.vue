<template>
	<ul v-if="item.children && item.children.length > 0 && item.closed==true">
		<template v-for="children in item.children">
			<child :text="item">
				 	<span class="child-item" @click="clickFunc(children)" @contextmenu.prevent="userDrawer(children)">
				 		<span :class="{rainbow:children.isCreator == 1}">
				 			<span class="person" :style="{'background-image':'url(' + children.imgURL + ')'}" :title="children.f_caption"></span>
				 		</span>
						<span class="name">{{children.person_name}}</span>
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
			userDrawer(children) {
				console.log(children)
				axios.get(this.$store.state.MYURL + 'QueryPerson.do', {
						params: {
							id: children.id,
						}
					})
					.then(res => {
						this.$store.commit("setDrawer", true);
						if(res.data.length != 0) {
							let data = this.dealData(res.data)
							this.$store.commit("setPersonData", data);
						} else {
							this.$store.commit("setPersonData", [{
								imgUrl: 'none.png'
							}]);
						}
					})
			},
			dealData(data) {
				for(let i = data.length - 1; i >= 0; i--) {
					if(data[i].isAllLife == "0") {
						if(moment(data[i].getTime, "YYYY-MM-DD").format("YYYYMMDD") >this.$store.state.currentTime 
//							||moment(data[i].endTime, "YYYY-MM-DD").format("YYYYMMDD") < moment(this.$store.state.currentTime).format("YYYYMMDD")
						) {
							data.splice(i, 1)
						}
					}
				}
				return data
			}
		}
	}
</script>