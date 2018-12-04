<template>
    <div class="container-fluid">
        <div class="row">
           <div class="col-sm-4 col-md-4 offset-sm-4 offset-md-4">
                <register-card @registerCredentials="checkCredentials"/>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import RegisterCard from '@/components/RegisterCard.vue'
    export default {
        components: {
            'register-card': RegisterCard
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