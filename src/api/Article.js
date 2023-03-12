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

export function getArticleTable(queryParam) {
	return request({
		method: 'post',
		url: '/admin/article/getArticleTable',
		data: {
			...queryParam
		}
	})
}