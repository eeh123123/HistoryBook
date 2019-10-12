<template>
	<div >
		<aaa></aaa>
	</div>
</template>

<script>
	var Aaa = Vue.extend({
		template: '<h3>标题</h3>'
	});
	Vue.component('aaa',Aaa);//注册
</script>

<style lang="css">

</style>