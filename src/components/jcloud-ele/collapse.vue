<template>
    <el-collapse class="options-collapse">
        <el-collapse-item>
            <template slot="icon"><i class="el-collapse-item__header__arrow el-icon-caret-right"></i></template>
            <template slot="title">
                {{ title }}
            </template>
            <template slot="extend-panel">
                <slot name="text"></slot>
            </template>
            <slot></slot>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
import { Collapse, CollapseItem } from 'jcloud-ele-ui';

export default {
    props: ['title'],
    components: {
        'el-collapse': Collapse,
        'el-collapse-item': CollapseItem
    }
}
</script>

<style>
.el-collapse-item{
    position: relative;
}
.el-collapse-item__extend-panel{
    position: absolute;
    top:0;
    right: 30px;
}
.options-collapse.el-collapse {
    border: none;
    margin-bottom: 10px;
}
.options-collapse .el-collapse-item__header, .options-collapse .el-collapse-item__wrap {
    border-bottom: none;
}
.options-collapse .el-collapse-item__header {
    height: 20px;
    line-height: 20px;
    color: #333;
}
</style>
