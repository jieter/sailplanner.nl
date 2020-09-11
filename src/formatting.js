export function formatDuration(seconds) {
    if (isNaN(seconds)) {
        return '';
    }
    let minutes = Math.round(seconds * 60);
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (hours <= 23) {
        return `${hours}:${minutes}`;
    } else {
        let days = Math.floor(hours / 24);
        hours = hours % 24;
        return `${days}d ${hours}:${minutes}`;
    }
}

export function roundn(value, n) {
    n = (n === undefined) ? 1 : Math.pow(10, n);
    return Math.round(value * n) / n;
}

export function smartRound(value) {
    if (isNaN(value)) {
        return '';
    }
    return roundn(value, value > 100 ? 0 : (value > 10 ? 1 : 2));
}