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
                var url = 'http://localhost:3003/drivers/register';
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
                        self.notification.show = true;
                        self.notification.msg = res.data.msg;
                        self.notification.variant = "info"
                    })
                    .catch(err => {
                        self.notification.show = true;
                        self.notification.msg = err.response.data.error;
                        self.notification.variant = "danger"
                    })
            }
        }
    }
</script>

<style lang="css" scoped>
    .container-fluid {
        margin-top: 60px;
    }
</style>