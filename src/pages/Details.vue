<template>
    <div class="details">
        <div v-if="item" class="details-wrap">
            <div class="top-bar">
                <div style="flex: 1; color: rgb(97, 127, 222);">
                    <el-checkbox v-model="item.state" :disabled="item.is_deleted == 1" class="checkbox-button" @change="updateList(item)"
                                 :class="{checked: item.state,priority1: item.priority == 1, priority2: item.priority == 2, priority3: item.priority == 3}"></el-checkbox>
                    <i class="icon iconfont icon-jintianmoushi" style="padding-left: 10px;cursor: pointer;"></i>
                    <span>{{dayjs(item.date).format('M月D日')}}</span>
                </div>
                <div style="width: 75px;">
                    <i class="icon iconfont button-icon" style="font-size: 22px;" :class="{'icon-youxianji1 priority1-color': item.priority == 1,
                        'icon-youxianji2 priority2-color': item.priority == 2, 'icon-youxianji priority3-color': item.priority == 3}"></i>
                </div>
            </div>
            <div class="conten-wrap">
                <div>
                    <el-input type="textarea" :disabled="item.is_deleted == 1" @change="updateList(item)" placeholder="准备做什么？" autosize v-model="item.title"></el-input>
                    <el-input class="remark" :disabled="item.is_deleted == 1" @change="updateList(item)" placeholder="描述" type="textarea" :autosize="{minRows: 20}" v-model="item.describe"></el-input>
                </div>
            </div>
            <div class="icon-bar-wrap">
                <el-row style="height: 50px;line-height: 50px;">
                    <el-col :span="12">
                        <i v-if="item.is_deleted == 0" class="icon iconfont icon-xiangziguanli sort-icon"></i>
                        <span v-else>
                            <i @click="resetItem()" class="icon iconfont icon-huifu sort-icon"></i>
                            恢复
                        </span>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <i v-if="item.is_deleted == 0" @click="deleteItem()" class="icon iconfont icon-lajitong sort-icon"></i>
                        <i v-else class="icon iconfont icon-lajitong1 sort-icon"></i>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-else class="tip">
            点击任务标题查看详情
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'Vuex'
    export default {
        name: "Details",
        data() {
            return {
            }
        },
        computed: {
            ...mapState({
                item: 'current_list_item'
            })
        },
        methods: {
            ...mapMutations([
                'current_list_item_mutations'
            ]),
            updateList(item) {
                this.$bus.$emit('updateList', item);
            },
            deleteItem(){
                this.item.is_deleted = 1;
                this.updateList(this.item);
                // 清空 当前选中lsit item
                this.current_list_item_mutations(null);
            },
            resetItem(){
                // this.item.is_deleted = 0;
                // this.updateList(this.item);
                // // 清空 当前选中lsit item
                // this.current_list_item_mutations(null);
            }
        },
    }
</script>

<style scoped lang="less">
    @import "../assets/css/style";

    .details {
        position: relative;
        min-height:100vh;
        border-left: 1px solid @border-color;
    }
    .details-wrap {
        min-height: calc(100vh - 51px);
    }
    .top-bar {
        display: flex;
        width: 100%;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid @border-color;
        padding: 0px 20px;

    }

    .icon-bar-wrap {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: calc(100% - 40px);
        padding: 0px 20px;
        border-top: 1px solid @border-color;
        background-color: #fff;
    }

    .conten-wrap {
        min-height: calc(100vh - 142px);
        padding: 15px 10px;
        background-color: #FAFAFA;
    }

    /deep/ .conten-wrap textarea {
        border: 0px;
        height: 44px;
        font-size: 16px;
        font-weight: 600;
    }

    /deep/ .remark textarea {
        font-weight: 400;
        font-size: 15px;

    }


    .checkbox-button {
        width: 40px;
        border-right: 1px solid @border-color;
        text-align: center;
    }
    .tip {
        min-height:100vh;
        line-height: 600px;
        text-align: center;
        color: #ccc;
        font-size: 30px;
        background-color: #FAFAFA;
    }
</style>
