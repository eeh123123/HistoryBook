<template>
	<div>
		<header></header>
		<div class="HolyGrail-body">
			<main class="HolyGrail-content" id="FWQ">
			</main>
			<nav class="HolyGrail-nav" id="DaQu">
			</nav>
			<div style="clear: both"></div>
		</div>
		<footer></footer>
	</div>
</template>

<script>
	let vm;

	export default {
		data() {
			return {
				MYURL: this.$store.state.MYURL,
			}
		},
		mounted() {
			vm = this;
			var DaQu_Length = 0;
			var DaQu_Array = [];
			var FWQ_data = "";
			var FWQ = "";
			$.get(vm.MYURL + "SearchDaQu.do", {}, function(data) {
				var DaQu = "";
				for(var i = 0; i < data.length; i++) {
					var obj = {
						[data[i].DaQu]: {}
					}
					DaQu_Array.push(data[i].DaQu);
					DaQu += "<div class='DaQu'>" + data[i].DaQu + "</div>";
				}
				DaQu_Length = i;
				$("#DaQu").append(DaQu);
				$.get(vm.MYURL + "SearchFWQ.do", {}, function(data) {
					for(var i = 0; i < DaQu_Length; i++) {
						FWQ_data = data;
						if(DaQu_Array[0] == data[i].DaQu) {
							FWQ += "<div class='FWQ'>" + data[i].FWQ + "</div>";
						}
					}
					$("#FWQ").append(FWQ);
					$(document).trigger("FWQ_Finished")
				}, "json");
			}, "json");
			$(document).unbind().bind("FWQ_Finished", function() {
				$(".DaQu").click(function() {
					var DaQu_Name = $(this).text();
					$("#FWQ").empty();
					FWQ = "";
					for(var i = 0; i < FWQ_data.length; i++) {
						if(DaQu_Name == FWQ_data[i].DaQu) {
							FWQ += "<div class='FWQ'>" + FWQ_data[i].FWQ + "</div>";
						}
					}
					$("#FWQ").append(FWQ);
				});
			});
		}
	}
</script>
<style lang="less" scoped>
	@import '../style/mixin';
</style>
<style lang="css" scoped>
	@import '../assets/styles/FWQ.css';
</style>