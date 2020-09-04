/* Take a json of legacy sailplanner.nl and turn into the current format.
 */
function transformFromLegacy(old) {
    const options = old.data.options;

    let data = {
        legacyUrl: old.url.replace('\/', '/'),
        comment: options.comment,
        settings: {
            average: options.average || 5,
            map: {
                center: options.center.split(',').map(x => +x),
                zoom: options.zoomlevel
            }
        },
        legs: old.data.legs.map(function(leg) {
            return {
                departure: leg.options.departure,
                path: leg.path,
                comment: leg.options.comment,
                color: leg.options.color.toLowerCase(),
                width: leg.options.width || 2
            }
        })
    };
    return data;
}

export { transformFromLegacy };