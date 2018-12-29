import axios from 'axios'

export default {
  data() {
    return {}
  },
  methods: {
    notifyToRequestManagement() {
      var self = this;
      var url = 'http://localhost:3010/requests';
      var requestToPost = self.request;
      axios({
        method: 'POST',
        url: url,
        data: requestToPost,
        headers: {
          'x-access-token': localStorage.access_token,
          'x-refresh-token': localStorage.refresh_token
        },
        timeout: 10000
      })
      .then(res => {
        console.log(res.data.msg);
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
}