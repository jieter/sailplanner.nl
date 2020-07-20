/* Take a json of legacy sailplanner.nl and turn into the current format.
 */
function transformFromLegacy(old) {
    let options = old.data.options;

    return {
        key: old.data.key,
        legacyUrl: old.url,
        comment: options.comment,
        settings: {
            average: options.average || 5,
            color: options.color,
            map: {
                center: options.center.split(" ").map(x => +x),
                zoom: options.zoom
            }
        },
        legs: old.data.legs.map(function(leg) {
            return {
                departure: leg.options.departure,
                path: leg.path,
                comment: leg.options.comment,
                color: leg.options.color,
                width: leg.options.width || 2,
                speed: leg.options.speed,
            }
        })
    };
}

export { transformFromLegacy };