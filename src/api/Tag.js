import request from "@/api/BaseRequest"

export function getTags() {
	return request({
		method: 'get',
		url: '/tags'
	})
}

export function getTagTable(queryParam) {
	return request({
		method: 'post',
		url: '/admin/tag/getTagTable',
		data: {
			...queryParam
		}
	})
}

export function saveTag(form) {
	return request({
		method: 'post',
		url: '/admin/tag/saveTag',
		data: {
			...form
		}
	})
}

export function updateTag(updateParam) {
	return request({
		method: 'post',
		url: '/admin/tag/updateTag',
		data: {
			...updateParam
		}
	})
}

export function deleteTag(deleteParam) {
	return request({
		method: 'post',
		url: '/admin/tag/deleteTag',
		data: {
			...deleteParam
		}
	})
}