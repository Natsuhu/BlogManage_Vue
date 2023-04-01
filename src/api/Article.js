import request from "@/api/BaseRequest"

export function saveArticle(form) {
	return request({
		method: 'post',
		url: '/admin/article/save',
		data: {
			...form
		}
	})
}

export function getArticleById(id) {
	return request({
		method: 'post',
		url: '/admin/article/getArticleById',
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
		url: '/admin/article/update',
		data: {
			...updateParam
		}
	})
}