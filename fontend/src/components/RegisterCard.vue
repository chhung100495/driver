<template>
    <div class="card">
        <div class="card-header text-white bg-dark">Đăng ký</div>
        <div class="card-body">
            <form>
                <div class="form-group row" style="margin-bottom: auto">
                    <div class="col-sm-12 col-md-12">
                        <b-alert class="text-left mb-3" :show="notification.show" :variant="notification.variant">
                            <span>{{ notification.msg }}</span>
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
                        <i class="fas fa-redo"></i>
                        <input type="password"
                            class="form-control"
                            ref="txtRetype"
                            @keyup="checkRetypeValidation"
                            v-validate="'required|confirmed:txtPassword'"
                            v-bind:class="retypeClass"
                            name="retype"
                            placeholder="Mật khẩu xác nhận">
                        <i v-bind:class="retypeIconClass"></i>
                        <small v-if="errors.has('retype') && focused" class="float-left mt-1 text-danger">{{ errors.first('retype') }}</small>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12 col-md-12">
                        <button ref="btnRegister" name="btnRegister" @click.prevent="handleSubmit" class="btn btn-outline-primary float-right">Đăng ký</button>
                        <router-link to="/login" tag="button" class="btn btn-outline-warning float-right mr-2">Hủy</router-link>
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
                'retypeClass': '',
                'usernameIconClass': '',
                'passwordIconClass': '',
                'retypeIconClass': '',
                focused: false
            }
        },
        props: [
            'notification'
        ],
        mounted() {
            var self = this;
            window.addEventListener('keydown', self.onEnter);
            self.$refs.txtRetype.addEventListener('focus', () => {
                self.focused = true;
                self.errors.remove('retype');
                self.retypeClass = '';
                self.retypeIconClass = '';
            });
        },
        beforeDestroy() {
            var self = this;
            window.removeEventListener('keydown', self.onEnter);
        },
        methods: {
            onEnter(){
                var self = this;
                if(event.keyCode === 13)
                   self.$refs.btnRegister.click();
            },
            handleSubmit() {
                var self = this;
                self.focused = true;
                self.$validator.validate().then(result => {
                    if (result) {
                        var username = this.$refs.txtUsername.value.trim();
                        var password = this.$refs.txtPassword.value.trim();
                        var credentials = {
                            'username': username,
                            'password': password
                        }
                        self.$emit('registerCredentials', credentials)
                    } else {
                        self.checkUsernameValidation();
                        self.checkPasswordValidation();
                        self.checkRetypeValidation();
                    }
                });
            },
            checkUsernameValidation() {
                var keyCode = event.keyCode || event.which
                var self = this;
                if ((keyCode != 9 && this.$refs.txtUsername.value) || keyCode == 13 || keyCode == 8 || event.target.name === 'btnRegister') {
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
                if ((keyCode != 9 && this.$refs.txtUsername.value) || keyCode == 13 || keyCode == 8 || event.target.name === 'btnRegister') {
                    if (!self.$validator.errors.has('password')) {
                        self.passwordClass = 'border border-success';
                        self.passwordIconClass = 'fas fa-check text-success';
                        return
                    }
                    self.passwordClass = 'border border-danger';
                    self.passwordIconClass = 'fas fa-times text-danger';
                    return
                }
            },
            checkRetypeValidation() {
                var keyCode = event.keyCode || event.which
                var self = this;
                if ((keyCode != 9 && this.$refs.txtUsername.value) || keyCode == 13 || keyCode == 8 || event.target.name === 'btnRegister') {
                    if (!self.$validator.errors.has('retype')) {
                        self.retypeClass = 'border border-success';
                        self.retypeIconClass = 'fas fa-check text-success';
                        return
                    }
                    self.retypeClass = 'border border-danger';
                    self.retypeIconClass = 'fas fa-times text-danger';
                    return
                }
            }
        }
    }
</script>

<style scoped>
    .fas.fa-user, .fas.fa-lock, .fas.fa-redo {
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