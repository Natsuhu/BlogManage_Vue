import request from "@/api/BaseRequest"

export function getAboutSetting() {
    return request({
        method: 'post',
        url: '/admin/about/getAboutSetting',
    })
}

export function updateAboutSetting(form) {
    return request({
        method: 'post',
        url: '/admin/about/updateAboutSetting',
        data: {
            ...form
        }
    })
}
