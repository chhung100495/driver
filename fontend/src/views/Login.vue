<template>
    <div class="container-fluid">
        <div class="row">
           <div class="col-sm-4 col-md-4 offset-sm-4 offset-md-4">
                <login-card @loginCredentials="checkCredentials" :error="error"/>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import LoginCard from '@/components/LoginCard.vue';
    import axios from 'axios';
    export default {
        data() {
            return {
                'error': {
                    'show': false,
                    'msg': ''
                }
            }
        },
        components: {
            'login-card': LoginCard
        },
        methods: {
            checkCredentials(args) {
                var self = this;
                var url = 'http://localhost:3003/drivers/login';
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
                        self.error.show = false;
                        self.error.msg = res.data.msg;
                        localStorage.id = res.data.id;
                        localStorage.username = res.data.username;
                        localStorage.access_token = res.data.access_token;
                        localStorage.refresh_token = res.data.refresh_token;
                        self.$router.push('/home');
                    })
                    .catch(err => {
                        self.error.show = true;
                        self.error.msg =  err.response.data.error;
                    })
            }
        }
    }
</script>

<style scoped>
    .container-fluid {
        margin-top: 60px;
    }
</style>