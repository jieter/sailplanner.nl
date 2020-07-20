export function formatDuration(seconds) {
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

export function roundn(float, n) {
    if (n === undefined) {
        return Math.round(float);
    }
    n = Math.pow(10, n);
    return Math.round(float * n) / n;
}

export function smartRound(float) {
    if (float > 100) {
        return Math.round(float);
    } else if (float > 10) {
        return roundn(float, 1);
    } else {
        return roundn(float, 2);
    }
}