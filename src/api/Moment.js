import request from "@/api/BaseRequest"

export function getMomentTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/moment/getMomentTable',
        data: {
            ...queryParam
        }
    })
}

export function getUpdateMoment(id) {
    return request({
        method: 'post',
        url: '/admin/moment/getUpdateMoment',
        params: {
            id
        }
    })
}

export function saveMoment(form) {
    return request({
        method: 'post',
        url: '/admin/moment/saveMoment',
        data: {
            ...form
        }
    })
}

export function updateMoment(form) {
    return request({
        method: 'post',
        url: '/admin/moment/updateMoment',
        data: {
            ...form
        }
    })
}

export function deleteMoment(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/moment/deleteMoment',
        data: {
            ...deleteParam
        }
    })
}
