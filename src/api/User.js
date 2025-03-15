import request from "@/api/BaseRequest"

export function getUserTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/user/getUserTable',
        data: {
            ...queryParam
        }
    })
}

export function updatePassword(form) {
    return request({
        method: 'post',
        url: '/admin/user/updatePassword',
        data: {
            ...form
        }
    })
}