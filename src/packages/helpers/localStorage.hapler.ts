export const getUserInfoFromLS = () => {
    const userInfo = JSON.parse(localStorage.getItem('user')!);
    return userInfo?.user;
}

export const getUserTokenLS = () => {
    const userInfo = JSON.parse(localStorage.getItem('user')!);
    return userInfo?.token;
}

export const getLoggedInUserId = () => {
    const userInfo =  getUserInfoFromLS();
    return userInfo?.user?.id;
}

export const getLoggedInUserName = () => {
    const userInfo =  getUserInfoFromLS();
    return userInfo?.user?.userName;
}