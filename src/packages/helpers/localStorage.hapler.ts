export const getUserInfoFromLS = () => {
    const userInfo = JSON.parse(localStorage.getItem('user')!);
    return userInfo;
}

export const getLoggedInUserId = () => {
    const userInfo =  getUserInfoFromLS();
    return userInfo?.id;
}

export const getLoggedInUserName = () => {
    const userInfo =  getUserInfoFromLS();
    return userInfo?.userName;
}