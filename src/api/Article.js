import request from "@/api/BaseRequest"

export function saveArticle(form) {
	return request({
		method: 'post',
		url: '/admin/article/saveArticle',
		data: {
			...form
		}
	})
}

export function getArticleById(id) {
	return request({
		method: 'post',
		url: '/admin/article/getUpdateArticle',
		params: {
			id
		}
	})
}

export function getArticleTable(queryParam) {
	return request({
		method: 'post',
		url: '/admin/article/getArticleTable',
		data: {
			...queryParam
		}
	})
}

export function updateArticle(updateParam) {
	return request({
		method: 'post',
		url: '/admin/article/updateArticle',
		data: {
			...updateParam
		}
	})
}

export function deleteArticle(deleteParam) {
	return request({
		method: 'post',
		url: '/admin/article/deleteArticle',
		data: {
			...deleteParam
		}
	})
}