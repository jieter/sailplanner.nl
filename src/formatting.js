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
    if (n === undefined) {
        return Math.round(value);
    }
    n = Math.pow(10, n);
    return Math.round(value * n) / n;
}

export function smartRound(value) {
    if (isNaN(value)) {
        return '';
    }
    if (value > 100) {
        return Math.round(value);
    } else if (value > 10) {
        return roundn(value, 1);
    } else {
        return roundn(value, 2);
    }
}