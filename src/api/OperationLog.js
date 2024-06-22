import request from "@/api/BaseRequest"

export function getOperationLogTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/operationLog/getOperationLogTable',
        data: {
            ...queryParam
        }
    })
}

export function deleteOperationLog(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/operationLog/deleteOperationLog',
        data: {
            ...deleteParam
        }
    })
}