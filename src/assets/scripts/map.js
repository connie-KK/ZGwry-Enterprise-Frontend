const map = {}

map.createMap = (divId, options) => {
    const map = L.map(divId, options);
    return map;
};
map.createTileLayer = async (map) => {
    //加载高德地图
    let tileLayer = await L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        maxZoom: 18,
        minZoom: 5
    });
    tileLayer.addTo(map);
    return tileLayer;
};
map.createIcon = options => {
    return L.icon(options);
};

/**
 * 通过 [x, y] 坐标添加 Maker
 *
 * @param {Object} map
 * @param {Object} latLng
 * @param {Object} options
 * 
 */
map.createMakerByXY = (map, coordinate, options = {}) => {
    let marker = L.marker(L.latLng(coordinate[0], coordinate[1]), options);
    marker.addTo(map);
    return marker;
};

map.createPopup = (map, options, latlng) => {
    let popup = L.popup(options)
        .setLatLng(latlng)
    return popup;
};

// 通过数组创建 latlng
map.createLatlonByArray = (coordinate) => {
    let latLng = L.latLng(coordinate[0], coordinate[1]);
    return latLng;
};

map.loadScript = () => {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(AMap)
        };
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=0c5aa2ad6ab0649af472b35b539fcd26&plugin=AMap.Geocoder&callback=init'
        script.onerror = reject
        document.head.appendChild(script)
    })
}
export default map