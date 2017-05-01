export function urlValidator(value) {
    return /^https?:\/\//.test(value);
}