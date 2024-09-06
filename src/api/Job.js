import request from "@/api/BaseRequest"

export function getTaskTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/task/getTaskTable',
        data: {
            ...queryParam
        }
    })
}

export function createTask(form) {
    return request({
        method: 'post',
        url: '/admin/task/createTask',
        data: {
            ...form
        }
    })
}

export function exec(form) {
    return request({
        method: 'post',
        url: 'admin/task/exec',
        data: {
            ...form
        }
    })
}

export function updateTaskStatus(form) {
    return request({
        method: 'post',
        url: '/admin/task/updateTaskStatus',
        data: {
            ...form
        }
    })
}

export function deleteTask(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/task/deleteTask',
        data: {
            ...deleteParam
        }
    })
}