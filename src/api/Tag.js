import request from "@/api/BaseRequest"

export function getTags() {
	return request({
		method: 'get',
		url: '/tags'
	})
}