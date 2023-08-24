import request from "@/api/BaseRequest"

export function upload(form) {
    return request({
        method: 'post',
        url: '/admin/annex/upload',
        //这个headers可以不用加，axios会自动补上，原理不是很懂
        headers: {'Content-Type': 'multipart/form-data'},
        data: form
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

export function deleteAnnex(data) {
    return request({
        method: 'post',
        url: '/admin/annex/deleteAnnex',
        data: {
            ...data
        }
    })
}

