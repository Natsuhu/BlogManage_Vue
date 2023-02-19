<template>
	<section class="app-main">
		<transition name="fade-transform" mode="out-in">
			<router-view :key="key" />
		</transition>
	</section>
</template>

<script>
	export default {
		name: 'AppMain',
		computed: {
			key() {
				return this.$route.path
			}
		}
	}
</script>

<style scoped>
	.fixed-header + .app-main {
		padding-top: 60px;
	}
	.app-main {
		min-height: calc(100vh - 50px);
		width: 100%;
		position: relative;
		overflow: hidden;
		padding: 20px;
	}
</style>

<style lang="scss">
	.el-popup-parent--hidden {
		.fixed-header {
			padding-right: 15px;
		}
	}
</style>
