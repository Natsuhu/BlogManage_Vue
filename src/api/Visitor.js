import request from "@/api/BaseRequest"

export function getVisitorTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/visitor/getVisitorTable',
        data: {
            ...queryParam
        }
    })
}