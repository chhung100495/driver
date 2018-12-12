import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from './views/Home.vue'
import RequestWindow from './components/RequestWindow.vue'
import axios from 'axios'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      meta: {
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        var url = 'http://localhost:3003/drivers/logout';
        var objToPost = {
            ID: localStorage.id,
        }
        var jsonToPost = JSON.stringify(objToPost);
        axios({
          method: 'POST',
          url: url,
          headers: {'x-access-token': localStorage.access_token},
          data: jsonToPost,
          timeout: 10000
        })
        .then(res => {
          console.log(res);
          localStorage.clear();
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    var token = localStorage.access_token;
    if (typeof token === 'undefined') {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;