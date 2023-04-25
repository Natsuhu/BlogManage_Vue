import request from "@/api/BaseRequest"

export function getCategories() {
	return request({
		method: 'get',
		url: '/categories'
	})
}

export function getCategoryTable(queryParam) {
	return request({
		method: 'post',
		url: '/admin/category/getCategoryTable',
		data: {
			...queryParam
		}
	})
}

export function saveCategory(form) {
	return request({
		method: 'post',
		url: '/admin/category/saveCategory',
		data: {
			...form
		}
	})
}

export function updateCategory(updateParam) {
	return request({
		method: 'post',
		url: '/admin/category/updateCategory',
		data: {
			...updateParam
		}
	})
}

export function deleteCategory(deleteParam) {
	return request({
		method: 'post',
		url: '/admin/category/deleteCategory',
		data: {
			...deleteParam
		}
	})
}