import request from "@/api/BaseRequest"

export function login(loginForm) {
    return request({
        method: 'post',
        url: '/admin/login',
        data: {
            ...loginForm
        }
    })
}

export function getBackLoginSetting() {
    return request({
        method: 'get',
        url: '/login/getBackLoginSetting'
    })
}