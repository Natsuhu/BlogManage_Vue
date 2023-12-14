import request from "@/api/BaseRequest"

export function getFriendTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/friend/getFriendTable',
        data: {
            ...queryParam
        }
    })
}

export function saveFriend(form) {
    return request({
        method: 'post',
        url: '/admin/friend/saveFriend',
        data: {
            ...form
        }
    })
}

export function updateFriend(form) {
    return request({
        method: 'post',
        url: '/admin/friend/updateFriend',
        data: {
            ...form
        }
    })
}

export function deleteFriend(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/friend/deleteFriend',
        data: {
            ...deleteParam
        }
    })
}

export function getFriendSetting() {
    return request({
        method: 'post',
        url: '/admin/friend/getFriendSetting',
    })
}

export function updateFriendSetting(form) {
    return request({
        method: 'post',
        url: '/admin/friend/updateFriendSetting',
        data: {
            ...form
        }
    })
}
