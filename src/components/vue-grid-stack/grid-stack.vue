<template>
    <div class="grid-stack" :data-gs-animate="animate"></div>
</template>
<script>
export default {
    name: 'grid-stack',
    props: ['animate','option'],
    data () {
        return {
            grid: null
        }
    },
    mounted () {
        const $gridStack = $('.grid-stack');
        $gridStack.gridstack(this.option);
        this.grid = $gridStack.data('gridstack');
        console.log(this.grid)
    }
};
</script>