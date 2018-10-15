<template>
    <div>
        <div class="login-wrap">
            <div class="login-title">
                <i class="icon iconfont icon-todoist" style="font-size: 100px;color: red;"></i>
                <div>
                    ToDoList
                </div>
            </div>
            <el-form :model="loginForm" status-icon ref="loginFormEl" label-width="70px" class="demo-ruleForm"
                     style="width: 370px">
                <el-form-item label="帐号" prop="email"
                              :rules="[{ required: true, message: '请输入帐号', trigger: 'blur' },
                                  { type: 'email', message: '格式有误', trigger: 'blur' }]">
                    <el-input type="text" v-model="loginForm.email" @keyup.enter.native="submitForm('loginFormEl')"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password"
                              :rules="[{ required: true, message: '请输入密码', trigger: 'blur' },
                                  { min:6, max: 20, message: '请输入6-20个字符', trigger: 'blur' }]">
                    <el-input type="password" v-model="loginForm.password"
                              @keyup.enter.native="submitForm('loginFormEl')" auto-complete="off"></el-input>
                    <el-checkbox v-model="checkedPwd">记住密码</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="submitForm('loginFormEl')">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="openRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-dialog title="注册" :visible.sync="dialogRegisterVisible">
                <el-form :model="registerForm" status-icon ref="registerForm" label-width="80px" class="demo-ruleForm"
                         style="width: 370px; margin: 0 auto;">
                    <el-form-item label="昵称" prop="name"
                                  :rules="[{ required: true, message: '请输入昵称', trigger: 'blur' },
                                  { min:3, max: 30, message: '请输入3-30个字符', trigger: 'blur' }]">
                        <el-input v-model="registerForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱账号" prop="email"
                                  :rules="[{ required: true, message: '请输入邮箱账号', trigger: 'blur' },
                                  { type: 'email', message: '格式有误', trigger: 'blur' }]">
                        <el-input v-model="registerForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password"
                                  :rules="[{ required: true, message: '请输入密码',  trigger: 'blur' },
                                  { min:6, max: 20, message: '请输入6-20个字符', trigger: 'blur' }]">
                        <el-input v-model="registerForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitRegisterForm('registerForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                baseUrl: this.$intfcUrl,

                loginForm: {
                    email: null,
                    password: null
                },
                dialogRegisterVisible: false,
                registerForm: {
                    email: '',
                    password: '',
                    name: ''
                },
                checkedPwd: false
            }
        },
        beforeMount() {
            var self = this;
            var todolist_LoginUser = JSON.parse(localStorage.getItem('todolist_LoginUser'));
            if (todolist_LoginUser) {
                self.loginForm.email = todolist_LoginUser.email;
                self.loginForm.password = todolist_LoginUser.password;
                self.checkedPwd = todolist_LoginUser.checkedPwd;
            }
        },
        methods: {
            openRegister() {
                this.dialogRegisterVisible = true;
            },
            submitRegisterForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/v1/users', {
                            name: self.registerForm.name,
                            password: self.registerForm.password,
                            email: self.registerForm.email,
                        }).then(function (res) {
                            if (res.data.code == 0) {
                                self.dialogRegisterVisible = false;
                                self.$message({
                                    message: '注册成功',
                                    type: 'success'
                                });
                            } else {
                                self.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch(function (err) {
                            self.$message({
                                message: '服务器繁忙，请稍候再试',
                                type: 'error'
                            });
                        });
                    }
                });
            },
            submitForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/v1/users/login', {
                            // self.$http.get('/static/data/user.json', {
                            email: self.loginForm.email,
                            password: self.loginForm.password,
                        }).then(function (res) {
                            if (res.data.code == 0) {
                                let loginUser = {};
                                localStorage.setItem('todolist_user', JSON.stringify(res.data.data));
                                self.$router.push({name: 'Home'});
                                if (self.checkedPwd) {
                                    loginUser.password = self.loginForm.password;
                                    loginUser.email = self.loginForm.email;
                                    loginUser.checkedPwd = true;
                                } else {
                                    loginUser.email = self.loginForm.email;
                                    loginUser.password = null;
                                    loginUser.checkedPwd = false;
                                }
                                localStorage.setItem('todolist_LoginUser', JSON.stringify(loginUser));

                            } else {
                                self.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch(function (err) {
                            console.log(err);
                            self.$message({
                                message: '服务器繁忙，请稍候再试',
                                type: 'error'
                            });
                        });
                    } else {
                    }
                });
            },

        },
    }
</script>


<style scoped>
    .login-wrap {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;
    }

    .login-title {
        font-size: 25px;
        text-align: center;
        margin-bottom: 15px;
        padding-left: 30px;
    }
</style>

