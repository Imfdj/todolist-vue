<template>
    <div class="list">
        <div style="display: flex;height: 36px;line-height: 36px;padding: 12px 20px">
            <div style="flex: 1;font-size: 22px;">
                {{active_name}}
            </div>
            <div style="flex: 1;text-align: right;">
                <el-dropdown trigger="click" @command="handleCommandSort">
                    <i class="icon iconfont sort-icon" :class="{'icon-timesort': sort_type == 1, 'icon-youxianjifeichangjinjix': sort_type == 2}" style="font-size: 23px;"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="date">
                            <i class="icon iconfont icon-timesort" style="font-size: 23px;padding-right: 10px;"></i>
                            <span>按时间</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="priority">
                            <i class="icon iconfont icon-youxianjifeichangjinjix"
                               style="font-size: 23px;padding-right: 10px;"></i>
                            <span>按优先级</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div style="margin: 0px 18px">
            <div class="addlist-box" :class="{'addlist-box-active': input_onfocus}">
                <el-input ref="title_ref" v-model="addList_params.title" @keyup.enter.native="addList" @focus="input_onfocus = true"
                          @blur="input_onfocus = false"
                          placeholder="添加'今天'的任务至'收集箱'" class="add-input"></el-input>
                <div class="icon-button-wrap" v-show="true">
                    <i @click="$refs.date_picker.focus();" class="icon iconfont icon-jintianmoushi button-icon"></i>
                    <el-date-picker
                        style="width: 0px;height: 30px;text-indent: -999em;"
                        ref="date_picker"
                        v-model="addList_params.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-dropdown trigger="click" @command="handleCommandPriority">
                        <i class="icon iconfont button-icon" :class="{'icon-youxianji1 priority1-color': addList_params.priority == 1,
                        'icon-youxianji2 priority2-color': addList_params.priority == 2, 'icon-youxianji priority3-color': addList_params.priority == 3}"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="3">
                                <i class="icon iconfont icon-youxianji priority3-color"
                                   style="padding-right: 10px;"></i>
                                <span>高优先级</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="2">
                                <i class="icon iconfont icon-youxianji2 priority2-color"
                                   style="padding-right: 10px;"></i>
                                <span>中优先级</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="1">
                                <i class="icon iconfont icon-youxianji1 priority1-color"
                                   style="padding-right: 10px;"></i>
                                <span>低优先级</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown trigger="click" @command="handleCommandCategory">
                        <i class="icon iconfont icon-xiangziguanli sort-icon"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">
                                <i class="icon iconfont icon-wenjian1" style="padding-right: 10px;"></i>
                                <span>收集箱</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class="list-conten-wrap">
            <el-scrollbar style="width: 100%; height: calc(100vh - 116px)">
                <div style="padding-right: 10px;">
                    <el-collapse v-model="activeNames" @change="handleChange" v-if="getList_data_past_due.length">
                        <el-collapse-item title="已过期" name="1">
                            <div>
                                <ListItem :data="getList_data_past_due" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames2" @change="handleChange" v-if="getList_data_today.length">
                        <el-collapse-item title="今天" name="1">
                            <div>
                                <ListItem :data="getList_data_today" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames3" @change="handleChange" v-if="getList_data_over_today.length">
                        <el-collapse-item title="接下来7天" name="1">
                            <div>
                                <ListItem :data="getList_data_over_today" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames5" @change="handleChange1" v-if="getList_data_priority3.length">
                        <el-collapse-item title="高优先级" name="1">
                            <div>
                                <ListItem :data="getList_data_priority3" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames6" @change="handleChange1" v-if="getList_data_priority2.length">
                        <el-collapse-item title="中优先级" name="1">
                            <div>
                                <ListItem :data="getList_data_priority2" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames7" @change="handleChange1" v-if="getList_data_priority1.length">
                        <el-collapse-item title="低优先级" name="1">
                            <div>
                                <ListItem :data="getList_data_priority1" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames4" @change="handleChange1" v-if="getList_data_deleted.length">
                        <el-collapse-item title="已删除" name="1">
                            <div>
                                <ListItem :data="getList_data_deleted" @getList="getList" :is_deleted="true"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse v-model="activeNames1" @change="handleChange1" v-if="getList_data_complete.length">
                        <el-collapse-item title="已完成" name="1">
                            <div>
                                <ListItem :data="getList_data_complete" @getList="getList"></ListItem>
                            </div>
                        </el-collapse-item>
                    </el-collapse>

                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    import ListItem from '../components/List-item'

    export default {
        name: "List",
        components: {
            ListItem
        },
        props: {},
        data() {
            return {
                msg1: '1111',
                input_onfocus: false,
                checked: false,
                getList_data_complete: [],
                getList_data_today: [],
                getList_data_past_due: [],
                getList_data_over_today: [],
                getList_data_deleted: [],
                getList_data_priority1: [],
                getList_data_priority2: [],
                getList_data_priority3: [],
                activeNames: ['1'],
                activeNames1: ['1'],
                activeNames2: ['1'],
                activeNames3: ['1'],
                activeNames4: ['1'],
                activeNames5: ['1'],
                activeNames6: ['1'],
                activeNames7: ['1'],

                addList_params: {
                    title: '',
                    describe: '',
                    priority: 1,
                    date: this.dayjs().format('YYYY-MM-DD'),
                    category_id: 1
                },
                sort_type: 1,
                active_name: '所有',
                getList_type: 0,


            }
        },
        beforeMount() {
            this.getList();
        },
        methods: {
            handleChange(val) {
                console.log(val);
            },
            handleChange1(val) {
                console.log(val);
            },
            handleCommandSort(value) {
                if (value == 'date') {
                    this.sort_type = 1;
                }
                if (value == 'priority') {
                    this.sort_type = 2;
                }
                this.getList();

            },

            handleCommandPriority(value) {
                this.addList_params.priority = parseInt(value);
            },
            handleCommandCategory(value) {
                this.addList_params.category_id = parseInt(value);
            },
            getList_data_resert_date() {
                this.getList_data_complete = [];
                this.getList_data_today = [];
                this.getList_data_past_due = [];
                this.getList_data_over_today = [];
                this.getList_data_priority1 = [];
                this.getList_data_priority2 = [];
                this.getList_data_priority3 = [];
                this.getList_data_deleted = [];
            },
            // 处理getList_data
            getList_dataFormat_date(date) {
                var self = this;
                date.forEach(function (v, i) {
                    v.state = !!v.state;
                    if (v.state) {
                        self.getList_data_complete.push(v);
                    } else if (self.dayjs(v.date).isSame(self.dayjs().format('YYYY-MM-DD'))) {
                        self.getList_data_today.push(v);
                    } else if (self.dayjs(v.date).isAfter(self.dayjs().format('YYYY-MM-DD'))) {
                        self.getList_data_over_today.push(v);
                    } else {
                        self.getList_data_past_due.push(v);
                    }
                })
            },
            // 处理getList_data
            getList_dataFormat_priority(date) {
                var self = this;
                date.forEach(function (v, i) {
                    v.state = !!v.state;
                    if (v.state) {
                        self.getList_data_complete.push(v);
                    } else if (v.priority == 1) {
                        self.getList_data_priority1.push(v);
                    } else if (v.priority == 2) {
                        self.getList_data_priority2.push(v);
                    } else if (v.priority == 3) {
                        self.getList_data_priority3.push(v);
                    }
                })
            },
            getList(type, pickDate) {
                var self = this;
                if (type !== undefined) {
                    self.getList_type = type;
                }
                self.$http.get('/v1/list/bydate', {
                // self.$http.get('/static/data/list.json', {
                    params: {
                        user_id: JSON.parse(localStorage.getItem('todolist_user')).id,
                        type: self.getList_type,
                        date: self.getList_type == 3 ? pickDate : null,
                        sort_type: this.sort_type
                    },
                }).then(function (res) {
                    self.getList_data_resert_date();
                    console.log(res.data);
                    if (res.data.code == 0) {
                        if (self.getList_type == 4) {

                            self.getList_data_deleted = res.data.data;
                        }else {
                            switch (self.sort_type) {
                                case 1:
                                    self.getList_dataFormat_date(res.data.data);
                                    break;
                                case 2:
                                    self.getList_dataFormat_priority(res.data.data);
                                    break;
                            }
                        }
                    } else {

                    }
                }).catch(function (err) {

                });
            },
            addList() {
                var self = this;
                self.$http.post('/v1/list', {
                    user_id: JSON.parse(localStorage.getItem('todolist_user')).id,
                    title: self.addList_params.title,
                    describe: self.addList_params.describe,
                    priority: self.addList_params.priority,
                    date: self.addList_params.date,
                    category_id: self.addList_params.category_id
                }).then(function (res) {
                    if (res.data.code == 0) {
                        // 清空title
                        self.addList_params.title = '';
                        self.getList();
                    } else {

                    }
                }).catch(function (err) {

                });
            }
        },
        watch: {
            'addList_params.date'(newValue, oldValue) {
                this.$refs.title_ref.focus();
            },
            'addList_params.priority'(newValue, oldValue) {
                this.$refs.title_ref.focus();
            },

        },

    }
</script>

<style scoped lang="less">
    @import "../assets/css/style";
    .list {
        min-height:100vh;
    }
    .addlist-box {
        display: flex;
        height: 34px;
        line-height: 34px;
        border: 1px solid rgba(0, 0, 0, 0.14);
    }

    .addlist-box-active {
        border: 1px solid rgb(97, 127, 222);
    }

    .add-input {
        flex: 1;
        border: 0px;
        height: 34px;
        line-height: 34px;
    }

    /deep/ .add-input .el-input__inner {
        border: 0px;
        height: 34px;
        line-height: 34px;
    }

    .addlist-box .icon-button-wrap {
        width: 100px;
        padding-top: 2px;

    }

    .addlist-box i {
        padding: 0px 3px;
    }

    .addlist-box .button-icon {
        font-size: 20px;
        cursor: pointer;
        color: rgb(97, 127, 222);
    }

    .list-conten-wrap {
        padding: 10px 20px;
    }

    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }

</style>
