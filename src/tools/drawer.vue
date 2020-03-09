<template>
	<el-drawer title="" :visible.sync="Drawer" :direction="direction" size='28.64%' class="personDrawer" :before-close="handleClose">
		<div class="top">
			<div class="floor1">
				<div class="close" @click="handleClose"></div>
			</div>
			<div class="floor2">
				<div class="left">
					<div class="floor1">
						<!--<div class="lord">
								<div class="circle"></div>
								<div class="lordName">领主</div>
							</div>-->
						<div class="name">{{PersonData[0]['person_name']}}</div>
						<div class="yours">
							<div class="circle"></div>
							<div class="yoursName">配偶</div>
						</div>
						<div class="death" v-if="death"></div>
						<div class="you" v-bind:style="{backgroundImage:'url(' + PersonData[0]['imgURL']||'none.png' + ')'}">
							<div class="circle"></div>
						</div>
					</div>
					<div class="floor2"></div>
				</div>
				<div class="right">
					<div class="top">
						<div class="old">{{old}}</div>
					</div>
					<div class="bottom">
						<div class="attribute1">
							<el-tooltip class="item" effect="light" v-for="(item,index) in PersonData" placement="bottom">
								<div slot="content">{{item.F_name}}<br/>{{item.attrF_caption}}</div>
								<div class="item" :key="index" v-bind:style="{backgroundImage:'url(' + item.attrUrl + ')'}"></div>
							</el-tooltip>
						</div>
						<div class="attribute2"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom">

		</div>
	</el-drawer>
</template>

<script>
	export default {
		computed: {
			Drawer() {
				return this.$store.state.Drawer
			},
			PersonData() {
				return this.$store.state.PersonData
			},
			old() {
				if(moment(this.$store.state.currentTime).format("YYYYMMDD")-moment(this.PersonData[0].death_date).format("YYYYMMDD")>0){
					this.death = true
					return  moment(this.PersonData[0].death_date).diff(moment(this.PersonData[0].born_date),'year')
				}
				return moment(this.$store.state.currentTime).diff(moment(this.PersonData[0].born_date),'year')
			},
		},
		data() {
			return {
				direction: 'ltr',
				death:false
			}
		},
		methods: {
			handleClose() {
				this.$store.commit("setDrawer", false);
			},
			QueryData() {

			},
		}
	}
</script>