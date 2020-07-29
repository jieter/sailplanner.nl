import { decode } from "polyline-encoded";;

function swap(it) {
    if (typeof it[0] == "number") {
        return [it[1], it[0]];
    } else {
        return it.map(coord => swap(coord));
    }
}

export const asGeoJSON = function(state) {
    return {
        type: "FeatureCollection",
        properties: {
            comment: state.comment,
        },
        features: state.legs.map(leg => {
            return {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: swap(decode(leg.path))
                },
                properties: {
                    departure: leg.departure,
                    dog: leg.dog,
                    color: leg.color,
                    width: leg.width,
                    speed: leg.speed
                }
            }
        })
    }
};

export const asKML = function(state) {
    return '';
};

export const asGPX = function(state) {
    let legs = [];

    return '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' +
        '<gpx version="1.1" creator="Sailplanner - http://sailplanner.nl" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
        '<metadata>' +
        `<desc><![CDATA[${state.comment}]]></desc>` +
        `<link href="${state.url}"><text>Sailplanner</text></link>` +
        '</metadata>' +
        legs.join('\n') +
        '</gpx>';
};