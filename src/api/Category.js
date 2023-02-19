import request from "@/api/BaseRequest"

export function getCategories() {
	return request({
		method: 'get',
		url: '/categories'
	})
}