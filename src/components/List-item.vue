<template>
    <div>
        <div style="display: flex;line-height: 34px;border: 1px solid #fff;" class="123"
             @click="listItemClick(item,$event)"
             v-for="(item, index) in data"
             :key="index">
            <div style="width: 25px;text-align: center;">
                <el-checkbox v-model="item.state" :disabled="is_deleted" @change="updateList(item)"
                             :class="{checked: item.state,priority1: item.priority == 1, priority2: item.priority == 2, priority3: item.priority == 3}"></el-checkbox>
            </div>
            <div style="flex: 1">
                <el-input v-model="item.title" :disabled="is_deleted" @change="updateList(item)"
                          class="add-input"></el-input>
            </div>
            <div style="width: 125px">
                <el-button size="small" type="text" disabled>收集箱</el-button>
                <span style="display: inline-block;width: 56px;color: red; text-align: center;">{{dayjs(item.date).format('M月D日')}}</span>
                <el-dropdown trigger="click" @command="handleCommandSort" v-if="!is_deleted">
                    <i class="icon iconfont icon-gengduo1 sort-icon" style="font-size: 15px"></i>
                    <el-dropdown-menu slot="dropdown" @click.native="handleCommandSortItem(item, $event)"
                                      style="width: 138px;">
                        <div class="icon-box-wrap">
                            <div class="title">日期</div>
                            <div style="line-height: 45px">
                                <i @click="dateChange(1, item)" class="icon iconfont icon-sun sort-icon"></i>
                                <i @click="dateChange(2, item)"
                                   class="icon iconfont icon-jintiandaomingtian sort-icon"></i>
                                <i @click="dateChange(3, item)" class="icon iconfont icon-tubiao204 sort-icon"></i>
                                <i @click="dateChange(4, item)" class="icon iconfont icon-rili sort-icon"></i>
                            </div>
                        </div>
                        <div class="icon-box-wrap" style="padding-top: 5px;">
                            <div class="title">优先级</div>
                            <div style="line-height: 45px">
                                <i @click="datePriority(1, item)"
                                   class="icon iconfont icon-youxianji1 sort-icon priority1-color"></i>
                                <i @click="datePriority(2, item)"
                                   class="icon iconfont icon-youxianji2 sort-icon priority2-color"></i>
                                <i @click="datePriority(3, item)"
                                   class="icon iconfont icon-youxianji sort-icon priority3-color"></i>
                            </div>
                        </div>
                        <el-dropdown-item command="date" disabled>
                            <span>移动到</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="delete">
                            <span>删除</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'Vuex'

    export default {
        name: "List-item",
        props: {
            data: {
                type: Array,
                required: true,
                default: [],
                handleCommandSort_value: ''
            },
            is_deleted: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data() {
            return {
                event_currentTarget: null
            }
        },
        beforeMount() {
            var self = this;
            this.$bus.$off('updateList');
            self.$bus.$on('updateList', function (item) {
                self.updateList(item);
            });
        },
        methods: {
            ...mapMutations([
                'current_list_item_mutations'
            ]),
            updateList(item) {
                var self = this;
                self.$http.put('/v1/list', {
                    id: item.id,
                    title: item.title,
                    describe: item.describe,
                    priority: item.priority,
                    user_id: item.user_id,
                    category_id: item.category_id,
                    date: item.date,
                    state: item.state ? 1 : 0,
                    is_deleted: item.is_deleted
                }).then(function (res) {
                    if (res.data.code == 0) {
                        self.$emit('getList');
                    } else {

                    }
                }).catch(function (err) {

                });
            },
            handleCommandSort(value) {
                this.handleCommandSort_value = value;
            },
            handleCommandSortItem(item, event) {
                console.log(event);
                switch (this.handleCommandSort_value) {
                    case 'delete':
                        item.is_deleted = 1;
                        this.updateList(item);
                        // 清空 当前选中lsit item
                        this.current_list_item_mutations(null);
                        break;
                }
                // this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);

                // event.currentTarget.style.display = 'none';

            },
            // 选中list item
            listItemClick(item, event) {
                // 如果存在 上一次选中 item，重置 class；
                if (this.event_currentTarget) {
                    this.event_currentTarget.className = '';
                }
                this.event_currentTarget = event.currentTarget;
                // 选中 item，给框；
                event.currentTarget.className = 'pick-list-border';
                this.current_list_item_mutations(item);
            },
            dateChange(type, item) {
                switch (parseInt(type)) {
                    case 1:
                        item.date = this.dayjs().format('YYYY-MM-DD');
                        this.updateList(item);
                        break;
                    case 2:
                        item.date = this.dayjs().add(1, 'day').format('YYYY-MM-DD');
                        this.updateList(item);
                        break;
                    case 3:
                        item.date = this.dayjs().add(7, 'day').format('YYYY-MM-DD');
                        this.updateList(item);
                        break;
                    case 4:
                        // item.date = this.dayjs().format('YYYY-MM-DD');
                        // this.updateList(item);
                        break;
                }
            },
            datePriority(type, item) {
                switch (parseInt(type)) {
                    case 1:
                        item.priority = 1;
                        this.updateList(item);
                        break;
                    case 2:
                        item.priority = 2;
                        this.updateList(item);
                        break;
                    case 3:
                        item.priority = 3;
                        this.updateList(item);
                        break;
                }
            }
        },
    }
</script>

<style scoped lang="less">
    @import "../assets/css/style";

    .icon-box-wrap {
        padding: 0px 10px;
        border-bottom: 1px solid @border-color;
        & i {
            font-size: 20px;
            padding: 0px 3px;
        }
        & .title {
            font-size: 13px;
            color: #999;
        }
    }

    .pick-list-border {
        border: 1px solid @border-color !important;
    }
</style>
