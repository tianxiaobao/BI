<script>
import { InputNumber } from 'jcloud-ele-ui';
export default {
    mixins: [InputNumber]
};
</script>
<style lang="less">
.el-input-number {
    width: 100px !important;
    border: 1px solid #e7e7e7;
    height: 30px;
    overflow: hidden;
    .el-input-number__decrease,
    .el-input-number__increase {
        width: 26px;
        height: 15px;
        background-color: #fff;
        border: 0;
        right: -3px;
        line-height: 26px;
        cursor: default;
        &:hover {
            color: #2aafff;
        }
    }
    .el-input-number__decrease {
        left: auto;
        bottom: 0px;
        border-top: 1px solid #e7e7e7;
        line-height: 20px;
        .el-icon-minus {
            transform:scale(1.6);
            top: -3px;
            left: -1px;
            position: relative;
            &:before {
                content: "-";
                
            }
        }
    }
    .el-input-number__increase {
        top: 0px;
        line-height: 22px;
        border-bottom: 1px solid #e7e7e7;
        .el-icon-plus {
            transform:scale(1.2);
            top: -5px;
            left: -1px;
            position: relative;
            &:before {
                content: "+";
            }
        }
    }
    .el-input {
        width: 77px !important;
        height: 30px;
        padding-left: 0px !important;
    }
    .el-input__inner {
        border: 0;
        border-right: 1px solid #e7e7e7 !important;
        height: 30px;
        margin: 0;
        position: relative;
        top: -2px;
    }
}
</style>