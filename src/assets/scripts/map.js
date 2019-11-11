import "leaflet/dist/leaflet.css"
import $L from "leaflet";

// 解决 leaflet 默认 maker 无法显示的问题
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";


const map = {}

const Map2 = $L.Map.extend({
    // 覆盖源码
    openPopup: function (popup, latlng, options) {
        if (!(popup instanceof L.Popup)) {
            popup = new L.Popup(options).setContent(popup);
        }
        if (latlng) {
            popup.setLatLng(latlng);
        }
        if (this.hasLayer(popup)) {
            return this;
        }
        if (this._popup && this._popup.options.autoClose) {
//                this.closePopup(); 修改了这块
        }
        this._popup = popup;
        return this.addLayer(popup);
    }
});


$L.map = function (id, options) {
    return new Map2(id, options);
};

const DefaultIcon = $L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
$L.Marker.prototype.options.icon = DefaultIcon;

map.createMap = (divId, options) => {
    const map = $L.map(divId, options);
    return map;
};
map.createTileLayer = async (map, url, options) => {
    let tileLayer = await $L.tileLayer(url, options);
    tileLayer.addTo(map);
    return tileLayer;
};
map.createIcon = options => {
    return $L.icon(options);
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
    let marker = $L.marker($L.latLng(coordinate[0], coordinate[1]), options);
    marker.addTo(map);
    return marker;
};

map.createPopup = (map, options,latlng) => {
    let popup = $L.popup(options)
    .setLatLng(latlng)
    return popup;
};

// 通过数组创建 latlng
map.createLatlonByArray = (coordinate) => {
    let latLng = $L.latLng(coordinate[0], coordinate[1]);
    return latLng;
};
export default map