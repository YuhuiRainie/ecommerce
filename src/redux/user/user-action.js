// export const setCurrentUser = user => {
//     return { type:'SET_CURRENT_USER',
//              playload:user
//     }
// }

export const setCurrentUser = user => ({
    type: 'SET_CURRENT_USER',
    payload: user
});