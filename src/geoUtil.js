(function () {
    'use strict';

    function bearing(a, b) {
        var d2r = Math.PI / 180;
        var dLon = (b.lng - a.lng) * d2r;
        var lat1 = a.lat * d2r;
        var lat2 = b.lat * d2r;

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    }

    if (L) {
        L.Polyline.include({
            _distanceMeters: function () {
                var latlngs = this.getLatLngs();

                if (latlngs.length < 2) {
                    return 0;
                }

                var distance = 0;
                for (var i = 1; i < latlngs.length; i++) {
                    distance += latlngs[i - 1].distanceTo(latlngs[i]);
                }

                return distance;
            },

            getDistance: function (type) {
                return this._distanceMeters() / 1852;
            },
        });
        L.extend(L.LatLng.prototype, {
            bearingTo: function (other) {
                return bearing(this, L.latLng(other));
            },
        });
    }
})();
