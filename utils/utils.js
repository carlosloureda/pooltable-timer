/**
 * Return unique user identifier
 * (Almost without collision)
 */
const uid = () => {
    return Math.random().toString(16).slice(2)+(new Date()).getTime().toString(16)
}

export const Utils = {
    uid
}