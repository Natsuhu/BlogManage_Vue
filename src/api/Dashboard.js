import request from "@/api/BaseRequest"

export function getTopBaseData() {
    return request({
        method: 'post',
        url: '/admin/dashboard/getTopBaseData',
    })
}

export function getCategoryEcharts() {
    return request({
        method: 'post',
        url: '/admin/dashboard/getCategoryEcharts',
    })
}

export function getTagEcharts() {
    return request({
        method: 'post',
        url: '/admin/dashboard/getTagEcharts',
    })
}

export function getMapEcharts() {
    return request({
        method: 'post',
        url: '/admin/dashboard/getMapEcharts',
    })
}

export function getVisitRecordEcharts() {
    return request({
        method: 'post',
        url: '/admin/dashboard/getVisitRecordEcharts',
    })
}