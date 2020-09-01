<template>
	<el-drawer :visible.sync="Drawer" :direction="direction" size='28.64%' class="personDrawer" :before-close="handleClose">
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
						<div class="attribute5Num">
							<div class="son"><div class="shejiao"></div>{{shejiao}}</div>
							<div class="son"><div class="junshi"></div>{{junshi}}</div>
							<div class="son"><div class="guanli"></div>{{guanli}}</div>
							<div class="son"><div class="mimou"></div>{{mimou}}</div>
							<div class="son"><div class="xueshi"></div>{{xueshi}}</div>						
						</div>
					</div>
					<div class="bottom">
						<div class="attribute1">
							<el-tooltip class="item" effect="light" v-for="(item,index) in PersonData" placement="bottom">
								<div slot="content">{{item.F_name}}<br/>{{item.attrF_caption}}
									<span v-if="item.waijiao"><br>外交：{{item.waijiao}}</span>
									<span v-if="item.guanli"><br>管理：{{item.guanli}}</span>
									<span v-if="item.junshi"><br>军事：{{item.junshi}}</span>
									<span v-if="item.mimou"><br>密谋：{{item.mimou}}</span>
									<span v-if="item.xueshi"><br>学识：{{item.xueshi}}</span>
								</div>
								<div class="item" :key="index" v-bind:style="{backgroundImage:'url(' + item.attrUrl + ')'}"></div>
							</el-tooltip>
						</div>
						<div class="attribute2"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="floor1"></div>
			<div class="floor2">
				<div class="content">
					<div class="floor1">
						<div class="floor1">
							<div class="son1">父母</div>
							<div class="son2">祖父母</div>
							<div class="son3">监护人</div>
						</div>
						<div class="floor2">
							<div class="son1">
								<div v-bind:style="{backgroundImage:'url(' + PersonData[0]['fatherImg']||'' + ')'}" class="circle parentImg"></div>
								<div v-bind:style="{backgroundImage:'url(' + PersonData[0]['motherImg']||'' + ')'}" class="circle parentImg"></div>
							</div>
							<div class="son2"></div>
							<div class="son3"></div>
						</div>
					</div>
					<div class="floor2"></div>
					<div class="floor3"></div>
				</div>
			</div>
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
				let shejiao=5
				let guanli=5
				let junshi=5
				let mimou=5
				let xueshi=5
				for(let i=0;i<this.$store.state.PersonData.length;i++){
					shejiao+=parseInt(this.$store.state.PersonData[i].shejiao||0)  
					guanli+=parseInt(this.$store.state.PersonData[i].guanli||0)  
					junshi+=parseInt(this.$store.state.PersonData[i].junshi||0)  
					mimou+=parseInt(this.$store.state.PersonData[i].mimou||0)  
					xueshi+=parseInt(this.$store.state.PersonData[i].xueshi||0)  
				}
				this.shejiao = shejiao
				this.guanli = guanli
				this.junshi = junshi
				this.mimou = mimou
				this.xueshi = xueshi
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
				death:false,
				shejiao:0,
				guanli:0,
				junshi:0,
				mimou:0,
				xueshi:0
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
