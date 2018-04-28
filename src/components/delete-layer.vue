<template>
	<!-- 删除 弹出层 -->
	<div class="popup delete-layer" style="display:none;">
		<div class="textCon f14">
	       确认删除{{deleteLayer.type}}：{{deleteLayer.name}}？
	  	 </div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: mapGetters(['deleteLayer'])
	}	
</script>