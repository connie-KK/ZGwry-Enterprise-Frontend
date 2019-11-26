// 解决 leaflet 默认 maker 无法显示的问题
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";


const map = {}

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

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

map.createPopup = (map, options,latlng) => {
    let popup = L.popup(options)
    .setLatLng(latlng)
    return popup;
};

// 通过数组创建 latlng
map.createLatlonByArray = (coordinate) => {
    let latLng = L.latLng(coordinate[0], coordinate[1]);
    return latLng;
};
export default map