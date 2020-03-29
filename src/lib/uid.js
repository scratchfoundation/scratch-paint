const soup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const uidLength = 20;

/**
 * Generates unique ID.
 * @return {string} Generated unique ID
 */
export default function () {
    let uid = '';
    for (let i = 0; i < uidLength; i++) {
        uid += soup.charAt(Math.ceil(Math.random() * soup.length));
    }
    return uid;
}
