<template>
    <div class="container-fluid">
        <div class="row">
           <div class="col-sm-4 col-md-4 offset-sm-4 offset-md-4">
                <login-card @loginCredentials="checkCredentials"/>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import LoginCard from '@/components/LoginCard.vue'
    export default {
        components: {
            'login-card': LoginCard
        },
        methods: {
            checkCredentials(args) {
                console.log(args.username);
                console.log(args.password);
            }
        }
    }
</script>

<style scoped>
</style>