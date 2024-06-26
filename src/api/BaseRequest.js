import axios, { Axios } from 'axios'
//请求进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const service = axios.create({
	headers: {'Content-Type': 'application/json'}
})

// 后端程序地址
service.defaults.baseURL = window.env.API_BASE_URL

// 超时时长配置
service.defaults.timeout =  window.env.AXIOS_TIMEOUT

// 请求拦截
service.interceptors.request.use(
	config => {
		const token = window.localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = token
		}
		NProgress.start()
		return config
	},
	error => {
		NProgress.done()
		console.info(error)
		Message.error(error.message)
		return Promise.reject(error)
	}
)

// 响应拦截
service.interceptors.response.use(
	config => {
		NProgress.done()
		return config.data
	},
	error => {
		NProgress.done()
		console.info(error)
		Message.error(error.message)
		return Promise.reject(error)
	}
)

export default service