export default {
  data() {
    return {
    }
  },
  methods: {
    handleErrors(error) {
      var self = this;
      if (error.response.status === 401) {
        self.$router.push('login');
      }
      console.log(error);
    }
  }
}