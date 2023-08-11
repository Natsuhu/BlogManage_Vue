import request from "@/api/BaseRequest"

export function getCommentTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/comment/getCommentTable',
        data: {
            ...queryParam
        }
    })
}

export function updateComment(updateParam) {
    return request({
        method: 'post',
        url: '/admin/comment/updateComment',
        data: {
            ...updateParam
        }
    })
}
