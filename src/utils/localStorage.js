const appName = 'culture-parse';

export const getItemFromLocalStorage = (key) => localStorage.getItem(`${appName}-${key}`);

export const removeItemFromLocalStorage = (key) => localStorage.removeItem(`${appName}-${key}`);

export const setItemInLocalStorage = (key, value) => localStorage.setItem(`${appName}-${key}`, value);
