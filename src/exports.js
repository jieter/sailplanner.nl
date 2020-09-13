import { decode } from 'polyline-encoded';;

function swap(it) {
    if (typeof it[0] == 'number') {
        return [it[1], it[0]];
    } else {
        return it.map(coord => swap(coord));
    }
}

// https://tools.ietf.org/html/rfc7946
export const asGeoJSON = function(state, url) {
    return JSON.stringify({
        type: 'FeatureCollection',
        properties: {
            comment: state.comment,
            url: url
        },
        features: state.legs.map(leg => {
            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: swap(decode(leg.path))
                },
                properties: {
                    comment: leg.comment,
                    departure: leg.departure,
                    dog: leg.dog,
                    color: leg.color,
                    width: leg.width
                }
            };
        })
    });
};

// https://www.ogc.org/standards/kml/
export const asKML = function(state, url) {
    const styles = state.legs.map((leg, i) => {
        return `<Style id="leg_${i}"><LineStyle>` +
            `<color>7f${leg.color.substring(1)}</color>` +
            `<width>${leg.width}</width>` +
            '</LineStyle>' +
            '</Style>';
    });

    const legs = state.legs.map((leg, i) => {
        const points = decode(leg.path).map(coord => `${coord[1]},${coord[0]}`);

        return `<Placemark id="${state.key}_${i}">\n` +
            `  <name><![CDATA[${leg.comment}]]></name>\n` +
            `  <styleUrl>#leg_${i}</styleUrl>\n` +
            '  <LineString>\n' +
            '    <tessellate>0</tessellate>\n' +
            `    <coordinates>${points.join(' ')}</coordinates>\n` +
            '  </LineString>' +
            '</Placemark>';
    });

    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<kml xmlns="http://earth.google.com/kml/2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
        '<Document>\n' +
        '<name>Sailplanner.nl</name>\n' +
        `<atom:link href="${url}" />\n` +
        `<description><![CDATA[${state.comment}]]></description>\n` +
        styles.join('\n') +
        legs.join('\n') +
        '</Document>' +
        '</kml>';

};

// https://www.topografix.com/gpx_manual.asp
export const asGPX = function(state, url) {
    let legs = state.legs.map((leg, i) => {
        const path = decode(leg.path).map(c => `<rtept lat="${c[0]}" lon="${c[1]}"></rtept>`);
        const SEP = '\n  ';

        return `<rte>${SEP}<name><![CDATA[${leg.comment}]]></name>${SEP}` +
            path.join(SEP) +
            '\n</rte>';
    });

    return '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
        '<gpx version="1.1" creator="Sailplanner - http://sailplanner.nl" xmlns="https://www.topografix.com/gpx/1/1/gpx.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +
        '<metadata>\n' +
        `  <desc><![CDATA[${state.comment}]]></desc>\n` +
        `  <link href="${url}"><text>Sailplanner</text></link>\n` +
        '</metadata>\n\n' +
        legs.join('\n\n') +
        '</gpx>';
};