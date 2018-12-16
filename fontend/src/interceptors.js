import axios from 'axios'

export default function setup() {
    // Add a request interceptor
    axios.interceptors.request.use((config) => {
        // let originalRequest = config;
        // Do something before request is sent
        return config;
    }, (error) => {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use((response) => {
        // Do something with response data

        // if original request response state is "loggedOut"
        if (response.data.state && response.data.state === "loggedOut") {
            // clear localStorage and redirect to login page
            console.log(response);
            localStorage.clear();
            window.location.href = "#/login";
        }
        return response;
    }, (error) => {
        // Do something with response error

        const originalRequest = error.config;
        // token expired
        if (error.response.status === 401 && error.response.data.error.name === "TokenExpiredError") {
            // try to get new access token through refresh token
            var url = 'http://localhost:3003/drivers/refresh';
            axios({
                method: 'POST',
                url: url,
                headers: {
                  'x-refresh-token': localStorage.refresh_token
                },
                timeout: 10000
            })
            .then(response => {
                // Get a new access token in data response
                if (response.data.access_token) {
                    // update to localStorage.access_token
                    localStorage.access_token = response.data.access_token;

                    // refresh headers['x-access-token'] of original request to recall through axios in below
                    originalRequest.headers['x-access-token'] = response.data.access_token;
                    // need reload page to update anything that changed except api logout
                    if (originalRequest.url != "http://localhost:3003/drivers/logout") {
                        window.location.reload(true);
                    }
                    return axios(originalRequest);
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    window.location.href = "#/login";
                }
                console.log(error);
            });
        }
        return Promise.reject(error);
    });
}
