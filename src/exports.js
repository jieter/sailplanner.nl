import { decode } from 'polyline-encoded';;

function swap(it) {
    if (typeof it[0] == 'number') {
        return [it[1], it[0]];
    } else {
        return it.map(coord => swap(coord));
    }
}

// https://tools.ietf.org/html/rfc7946
export const asGeoJSON = function(state) {
    return JSON.stringify({
        type: 'FeatureCollection',
        properties: {
            comment: state.comment,
        },
        features: state.legs.map(leg => {
            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: swap(decode(leg.path))
                },
                properties: {
                    departure: leg.departure,
                    dog: leg.dog,
                    color: leg.color,
                    width: leg.width,
                    speed: leg.speed
                }
            };
        })
    });
};

// https://www.ogc.org/standards/kml/
export const asKML = function(state) {
    const styles = state.legs.map((leg, i) => {
        `<Style id="leg_${i}"><LineStyle>` +
        `<color>7f${leg.color.substring(1)}</color>` +
        `<width>${leg.width}</width>` +
        '</LineStyle>' +
        '</Style>';
    });

    const legs = state.legs.map((leg, i) => {
        const points = decode(leg.path).map(coord => `${coord[1]},${coord[0]}`);

        return `<Placemark id="${state.key}_${i}">` +
            `<name><[CDATA[${leg.comment}]]></name>` +
            `<styleUrl>#leg_${i}</styleUrl>` +
            '<LineString>' +
            '<tessellate>0</tessellate>' +
            `<coordinates>${points.join(' ')}</coordinates>` +
            '</LineString>' +
            '</Placemark>';
    });

    return '<?xml version="1.0" encoding="UTF-8"?>' +
        '<kml xmlns="http://earth.google.com/kml/2.0" xmlns:atom="http://www.w3.org/2005/Atom">' +
        '<Document>' +
        '<name>Sailplanner</name>' +
        `<atom:link href="${state.url}" />` +
        `<description><![CDATA[${state.comment}]]></description>` +
        styles.join('\n') +
        legs.join('\n') +
        '</Document>' +
        '</kml>';

};

// https://www.topografix.com/gpx_manual.asp#:~:text=GPX%20(the%20GPS%20eXchange%20Format,web%20services%20on%20the%20Internet.&text=The%20descriptions%20in%20this%20document,the%20definitive%20definition%20of%20GPX.
export const asGPX = function(state) {
    let legs = state.legs.map((leg, i) => {
        const path = decode(leg.path).map(c => `<rtep lat="${c[0]}" lon="${c[1]}"></rtept>`);

        return `<rte>\n<name><![CDATA[${leg.comment}']]></name>\n` +
            path.join('\n') +
            '</rte>';
    });

    return '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' +
        '<gpx version="1.1" creator="Sailplanner - http://sailplanner.nl" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
        '<metadata>' +
        `<desc><![CDATA[${state.comment}]]></desc>` +
        `<link href="${state.url}"><text>Sailplanner</text></link>` +
        '</metadata>' +
        legs.join('\n') +
        '</gpx>';
};