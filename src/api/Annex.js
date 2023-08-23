import request from "@/api/BaseRequest"

export function upload(form) {
    return request({
        method: 'post',
        url: '/admin/annex/upload',
        data: {
            ...form
        }
    })
}

export function download(annexId) {
    return request({
        method: 'get',
        responseType: 'blob',
        url: `/admin/annex/download/${annexId}`
    })
}

export function getSuffixSelector() {
    return request({
        method: 'post',
        url: '/admin/annex/getSuffixSelector'
    })
}

export function getAnnexTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/annex/getAnnexTable',
        data: {
            ...queryParam
        }
    })
}

export function updateAnnex(data) {
    return request({
        method: 'post',
        url: '/admin/annex/updateAnnex',
        data: {
            ...data
        }
    })
}
