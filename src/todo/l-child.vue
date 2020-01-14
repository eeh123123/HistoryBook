<template>
	<li>
		<a herf="#">
			<slot></slot>
		</a>
	</li>
</template>
<script>
	export default {
		name: 'child',
		props: {
			text: {
				type: Object,
				required: true
			}
		},
		methods: {

		}
	}
</script>