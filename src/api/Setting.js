import request from "@/api/BaseRequest"

export function getCommonSetting() {
    return request({
        method: 'post',
        url: '/admin/setting/getCommonSetting',
    })
}

export function updateCommonSetting(form) {
    return request({
        method: 'post',
        url: '/admin/setting/updateCommonSetting',
        data: {
            ...form
        }
    })
}

export function getCardSetting() {
    return request({
        method: 'post',
        url: '/admin/setting/getCardSetting',
    })
}

export function updateCardSetting(form) {
    return request({
        method: 'post',
        url: '/admin/setting/updateCardSetting',
        data: {
            ...form
        }
    })
}

export function getFooterSetting() {
    return request({
        method: 'post',
        url: '/admin/setting/getFooterSetting',
    })
}

export function updateFooterSetting(form) {
    return request({
        method: 'post',
        url: '/admin/setting/updateFooterSetting',
        data: {
            ...form
        }
    })
}