<template>
    <div class="home">
        <div style="width: 250px">
            <el-menu
                style="height: 100%"
                default-active="所有"
                class="el-menu-vertical"
                background-color="#5069C4"
                text-color="#fff"
                :collapse="false"
                :unique-opened="true"
                @open="handleOpen"
                @select="handleSelect"
                @close="handleClose">
                <div class="tool-bar">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <img class="avatar"
                             src="https://profile-photo.s3.cn-north-1.amazonaws.com.cn/files/avatar/50648/MTAxMjk3ODc2Nm9pdWhxcWtl/avatar.png?v=3a4552cf77f92807a3240ee34428a6f2">
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="tongji">统计</el-dropdown-item>
                            <el-dropdown-item disabled>帮助中心</el-dropdown-item>
                            <el-dropdown-item command="quit">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span class="user-name">{{username}}</span>
                </div>
                <el-menu-item index="所有">
                    <i class="icon iconfont icon-suoyou"></i>
                    <span slot="title">所有</span>
                </el-menu-item>
                <el-menu-item index="今天">
                    <i class="icon iconfont icon-jintianmoushi"></i>
                    <span slot="title">今天</span>
                </el-menu-item>
                <el-menu-item index="最近7天">
                    <i class="icon iconfont icon-tubiao204"></i>
                    <span slot="title">最近7天</span>
                </el-menu-item>
                <el-menu-item index="日历">
                    <i class="icon iconfont icon-rili"></i>
                    <span slot="title">日历</span>
                    <el-date-picker
                        style="width: 0px;height: 30px;text-indent: -999em;"
                        ref="date_picker"
                        v-model="pickDate"
                        type="date"
                        @change="handlePickDate"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-menu-item>
                <el-submenu index="类别">
                    <template slot="title">
                        <i class="icon iconfont icon-wenjian1"></i>
                        <span>类别</span>
                    </template>
                    <el-menu-item index="0" disabled>
                        <i class="icon iconfont icon-jihe"></i>
                        <span slot="title">收集箱</span>
                    </el-menu-item>
                    <el-menu-item index="添加类别" disabled>
                        <i class="icon iconfont icon-jiahao"></i>
                        <span slot="title">添加类别</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="已完成">
                    <i class="icon iconfont icon-wancheng"></i>
                    <span slot="title">已完成</span>
                </el-menu-item>
                <el-menu-item index="垃圾桶">
                    <i class="icon iconfont icon-lajitong"></i>
                    <span slot="title">垃圾桶</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div style="flex: 1;">
            <div style="display: flex;overflow: hidden;">
                <div style="flex: 1">
                    <List ref="List"></List>
                </div>
                <div style="flex: 1">
                    <Details></Details>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import List from './List'
    import Details from './Details'
    import {mapMutations} from 'Vuex'

    export default {
        name: "Home",
        components: {
            List,
            Details
        },
        created() {

            this.username = JSON.parse(localStorage.getItem('todolist_user')).name;
        },
        data() {
            return {
                username: '',
                pickDate: '',
            }
        },

        methods: {
            ...mapMutations([
                'current_list_item_mutations'
            ]),
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(value, arr) {
                // 清空 当前选中lsit item
                this.current_list_item_mutations(null);
                switch (value) {
                    case '所有':
                        this.$refs.List.getList(0);
                        break;
                    case '今天':
                        this.$refs.List.getList(1);
                        break;
                    case '最近7天':
                        this.$refs.List.getList(2);
                        break;
                    case '日历':
                        this.$refs.date_picker.focus();
                        break;
                    case '已完成':
                        this.$refs.List.getList(5);
                        break;
                    case '垃圾桶':
                        this.$refs.List.getList(4);
                        break;
                }
                this.$refs.List.active_name = value;

            },
            handlePickDate() {
                this.$refs.List.getList(3, this.pickDate);
            },
            handleCommand(value) {
                switch (value) {
                    case 'quit':
                        this.loginOut();
                        break;
                }
                console.log(value);

            },
            loginOut() {
                var self = this;
                self.$http.get('/v1/users/logout', {
                    params: {
                    },
                }).then(function (res) {
                    if (res.data.code == 0) {
                        localStorage.removeItem('todolist_user');
                        self.$router.push({
                            path: '/login'
                        });
                    } else {
                    }
                }).catch(function (err) {

                });
            }
        }
    }
</script>

<style scoped>
    .home {
        display: flex;
        min-height:100vh;
    }

    >>> .el-menu-item.is-active {
        color: #fff;
        background-color: #455AA8 !important;
    }

    >>> .el-submenu .el-menu-item {
        height: 40px;
        line-height: 40px;
    }

    >>> .el-menu-item {
        height: 40px;
        line-height: 40px;
    }
    .home >>> .el-icon-arrow-down {
        color: #fff;
    }
    .tool-bar {
        height: 36px;
        padding: 12px;
        color: #fff;
        display: flex;
    }

    .tool-bar .avatar {
        height: 36px;
        width: 36px;
        border-radius: 50%;
        cursor: pointer;
    }

    .tool-bar .user-name {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding-left: 15px;
    }

    .el-menu-vertical i {
        color: #fff;
    }
</style>
