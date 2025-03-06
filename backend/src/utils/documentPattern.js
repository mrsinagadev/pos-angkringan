export const setCode = (key) => {
    const code = Math.floor(Math.random() * Date.now());
    return `${key}${code}`;
}

export const setOrderCode = (key) => {
    const code = Math.floor(Date.now());
    return `${key}${code}`;
}