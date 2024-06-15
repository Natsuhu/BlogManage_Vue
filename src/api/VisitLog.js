import request from "@/api/BaseRequest"

export function getVisitLogTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/visitLog/getVisitLogTable',
        data: {
            ...queryParam
        }
    })
}

export function deleteVisitLog(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/visitLog/deleteVisitLog',
        data: {
            ...deleteParam
        }
    })
}