var toRad = x => {
    return x * Math.PI / 180;
};

exports.calculate = (lat1, lng1, lat2, lng2) => {
    var lat1 = Number(lat1);
    var lat2 = Number(lat2);
    var lng1 = Number(lng1);
    var lng2 = Number(lng2);
    var R = 6371; // km
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lng2 - lng1;
    var dLng = toRad(x2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d; // convert km to m
}
