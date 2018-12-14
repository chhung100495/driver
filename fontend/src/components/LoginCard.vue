<template>
    <div class="card">
        <div class="card-header text-white bg-dark">Driver System</div>
        <div class="card-body">
            <form>
                <div class="form-group row" style="margin-bottom: auto">
                    <div class="col-sm-12 col-md-12">
                        <b-alert class="text-left mb-3" :show="error.show" variant="danger">
                            <span>{{ error.msg }}</span>
                        </b-alert>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12 col-md-12">
                        <i class="fas fa-user"></i>
                        <input type="text"
                            class="form-control"
                            ref="txtUsername"
                            @keyup="checkUsernameValidation"
                            v-validate="'required'"
                            v-bind:class="usernameClass"
                            name="username"
                            placeholder="Tên đăng nhập"
                            autofocus>
                        <i v-bind:class="usernameIconClass"></i>
                        <small v-if="errors.has('username')" class="float-left mt-1 text-danger">{{ errors.first('username') }}</small>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12 col-md-12">
                        <i class="fas fa-lock"></i>
                        <input type="password"
                            class="form-control"
                            ref="txtPassword"
                            @keyup="checkPasswordValidation"
                            v-validate="'required'"
                            v-bind:class="passwordClass"
                            name="password"
                            placeholder="Mật khẩu">
                        <i v-bind:class="passwordIconClass"></i>
                        <small v-if="errors.has('password')" class="float-left mt-1 text-danger">{{ errors.first('password') }}</small>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12 col-md-12">
                        <button ref="btnLogin" name="btnLogin" @click.prevent="handleSubmit" class="btn btn-outline-primary float-right">Đăng nhập</button>
                    </div>
                </div>
                <hr/>
                <div class="form-group row">
                    <div class="col-sm-12 col-md-12">
                        <router-link class="float-left" to="/register">Đăng ký tài khoản</router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                'usernameClass': '',
                'passwordClass': '',
                'usernameIconClass': '',
                'passwordIconClass': ''
            }
        },
        props: [
           'error'
        ],
        mounted() {
            var self = this;
            window.addEventListener('keydown', self.onEnter);
        },
        beforeDestroy() {
            var self = this;
            window.removeEventListener('keydown', self.onEnter);
        },
        methods: {
            onEnter(){
                var self = this;
                if(event.keyCode === 13)
                   self.$refs.btnLogin.click();
            },
            handleSubmit() {
                var self = this;
                self.$validator.validate().then(result => {
                    if (result) {
                        var username = this.$refs.txtUsername.value.trim();
                        var password = this.$refs.txtPassword.value.trim();
                        var credentials = {
                            'username': username,
                            'password': password
                        }
                        self.$emit('loginCredentials', credentials)
                    } else {
                        self.checkUsernameValidation();
                        self.checkPasswordValidation();
                    }
                });
            },
            checkUsernameValidation() {
                var keyCode = event.keyCode || event.which
                var self = this;
                if ((keyCode != 9 && this.$refs.txtUsername.value) || keyCode == 13 || keyCode == 8 || event.target.name === 'btnLogin') {
                    if (!self.$validator.errors.has('username')) {
                        self.usernameClass = 'border border-success';
                        self.usernameIconClass = 'fas fa-check text-success';
                        return
                    }
                    self.usernameClass = 'border border-danger';
                    self.usernameIconClass = 'fas fa-times text-danger';
                    return
                }
            },
            checkPasswordValidation() {
                var keyCode = event.keyCode || event.which
                var self = this;
                if ((keyCode != 9 && this.$refs.txtUsername.value) || keyCode == 13 || keyCode == 8 || event.target.name === 'btnLogin') {
                    if (!self.$validator.errors.has('password')) {
                        self.passwordClass = 'border border-success';
                        self.passwordIconClass = 'fas fa-check text-success';
                        return
                    }
                    self.passwordClass = 'border border-danger';
                    self.passwordIconClass = 'fas fa-times text-danger';
                    return
                }
            }
        }
    }
</script>

<style lang="css" scoped>
    .fas.fa-user, .fas.fa-lock {
        position: absolute;
        top: 10px;
        left: 32px;
        z-index: 999;
    }

    .fas.fa-check, .fas.fa-times{
        position: absolute;
        top: 10px;
        right: 32px;
        z-index: 9999;
    }

    .form-control {
        position: relative;
        padding-left: 45px !important;
        padding-right: 45px !important;
    }
</style>