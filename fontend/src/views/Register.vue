<template>
    <div class="container-fluid">
        <div class="row">
           <div class="col-sm-4 col-md-4 offset-sm-4 offset-md-4">
                <register-card @registerCredentials="checkCredentials" :notification="notification"/>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import RegisterCard from '@/components/RegisterCard.vue';
    import axios from 'axios';
    export default {
        data() {
            return {
                'notification': {
                    'show': false,
                    'msg': '',
                    'variant': ''
                }
            }
        },
        components: {
            'register-card': RegisterCard,
        },
        methods: {
            checkCredentials(args) {
                var self = this;
                var url = 'http://localhost:3000/users/register';
                var objToPost = {
                    Username: args.username,
                    Password: args.password
                }
                var jsonToPost = JSON.stringify(objToPost);
                axios({
                        method: 'POST',
                        url: url,
                        data: jsonToPost,
                        timeout: 10000
                    })
                    .then(res => {
                        if(res.status === 201 && res.data.success === true) {
                            self.notification.show = true;
                            self.notification.msg = "Đăng ký thành công.";
                            self.notification.variant = "info"
                        } else {
                            self.notification.show = true;
                            self.notification.msg = "Tên đăng nhập đã tồn tại.";
                            self.notification.variant = "danger"
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        self.notification.show = true;
                        self.notification.msg = "Đăng ký thất bại.";
                        self.notification.variant = "danger"
                    })
            }
        }
    }
</script>

<style scoped>
</style>