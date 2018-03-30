var crypto = require('crypto');
var PRIVATE_KEY = 'chinaweather_data';
var APPID = '6f688d62594549a2';
var http = require('http')
var legends = [
    './img/df/降水预报图例－雨.png',
]
var urlArr =  [
    'http://scapi.weather.com.cn/weather/micapsfile?fileMark=js_24_fc&isChina=true',
    'http://scapi.weather.com.cn/weather/micapsfile?fileMark=js_48_fc&isChina=true',
    'http://scapi.weather.com.cn/weather/micapsfile?fileMark=js_72_fc&isChina=true',
    'https://scapi.tianqi.cn/weather/yjtc?mold=zhyb&type=gaowen&map=china',
    'https://scapi.tianqi.cn/weather/yjtc?mold=zhyb&type=scyb&map=china',
    'http://scapi.weather.com.cn/weather/micapsfile?fileMark=fog_fc&isChina=true',
    'http://scapi.weather.com.cn/weather/micapsfile?fileMark=haze_fc&isChina=true',
    'https://scapi.tianqi.cn/weather/yjtc?mold=zhyb&type=dfjw&map=china'
]
var curUrl = [
    'https://decisionappjson.tianqi.cn/js_data/china/precipitation1h.json',
    'https://decisionappjson.tianqi.cn/js_data/china/rainfall3.json',
    'https://decisionappjson.tianqi.cn/js_data/china/rainfall6.json',
    'https://decisionappjson.tianqi.cn/js_data/china/rainfall12.json',
    'https://decisionappjson.tianqi.cn/js_data/china/rainfall24.json',
    'https://decisionappjson.tianqi.cn/js_data/china/windspeed.json',
    'https://decisionappjson.tianqi.cn/js_data/china/visibility.json',
    'https://decisionappjson.tianqi.cn/js_data/china/balltemp.json',
    'http://api.tianqi.cn:8070/v1/img.py'
]
var layers = []
var curLayers = []
function encryURL(url, private_key, appid,type) {
    var myDate = timeObj();
    var date = myDate.year+myDate.month+myDate.date+myDate.hours+myDate.minutes;
    url += (~url.indexOf('?')?'&':'?') +'&date='+date+'&appid='+appid;
    var hmac = crypto.createHmac('sha1', private_key);
    hmac.write(url);
    hmac.end();
    var key = hmac.read().toString('base64');
    key = encodeURIComponent(key);
    return url.replace(/appid=.*/,'appid='+appid.substr(0,6)) + '&key=' + key;
}

function drawArea(data,index){
    _data = data[0]['areas']
    layers[index] = L.layerGroup()
    _data.forEach(v => {
        var c = v.c
        var items = []
        v.items.forEach(item => {
            items.push([item.y,item.x])
        })
        layers[index].addLayer(L.polygon(items, {
            color: c,
            stroke:false,
            fillOpacity: 0.6,
            smoothFactor: 0
        }))
    });
    layers[index].addTo(map)
    resetZIndex()
    $('.loading_tip').hide()
}
function transtime(t,n,i){
    var t1 = parseInt(t) + i*24*3600000;
    var oDate = new Date(t1);
    var str = oDate.getFullYear()+'-'+addZero(oDate.getMonth()+1)+'-'+addZero(oDate.getDate())+' '+addZero(oDate.getHours())+':'+addZero(oDate.getMinutes());
    var t2 = parseInt(t) + (n*3600000);
    var oDate1 = new Date(t2);
    str += (' 至 '+oDate1.getFullYear()+'-'+addZero(oDate1.getMonth()+1)+'-'+addZero(oDate1.getDate())+' '+addZero(oDate1.getHours())+':'+addZero(oDate1.getMinutes()));
    return str;
}
function addZero(n){return n>=10?n+'':'0'+n;}
//时间函数
function timeObj(){
    var oDate = new Date();
    return {
        "year":oDate.getFullYear(),
        "month":addZero(oDate.getMonth()+1),
        "date":addZero(oDate.getDate()),
        "hours":addZero(oDate.getHours()),
        "minutes":addZero(oDate.getMinutes())
    }
}
function resetZIndex(){
    var _g = $('.leaflet-pane.leaflet-overlay-pane svg g')
    $.each($('.leaflet-pane.leaflet-overlay-pane svg g path'),function(index,value){
        var _this =  value
        if($(_this).attr('fill') === 'none'){
            _g.append(_this)
        }
    })
}
//地图添加多边形
function creatPolygon(obj,index){
    layers[index] = L.layerGroup()
    for (var i = 0; i < obj.length; i++) {
        var arr = obj[i].items;
        var c = obj[i].c;
        var points = [];
        for (var j = 0; j < arr.length; j++) {
            points.push( [arr[j].y,arr[j].x] );
        }
        layers[index].addLayer(L.polygon(points, {
            color: c,
            stroke:false,
            fillOpacity: 0.6,
            smoothFactor: 0
        }))
    }
    layers[index].addTo(map)
    resetZIndex()
}
function formatT(s,n=1){
    let t_start = new Date(s)
    let t_end = new Date(s - 60*1000*60*n)
    const h_start = addZero(t_start.getHours())
    const h_end = addZero(t_end.getHours())
    return  h_end + '时 - ' + h_start + '时'
}
// 实况数据渲染
function cur_Polygon(data,index,str,oDate=""){
    curLayers[index] = L.layerGroup()
    $('#title_info h3').html(str)
    $('#title_info p').html(oDate)
    $('#title_info').show()
    const result = data.l
    result.forEach(function(v){
        const color = `rgba(${v.c.join(',')})`
        let arr = v.p.split(';')
        arr = arr.map(function(v){
            return v.split(',').reverse()
        })
        curLayers[index].addLayer(L.polygon(arr, {
            color,
            stroke:false,
            fillOpacity: 0.6,
            smoothFactor: 0
        }))
    })
    curLayers[index].addTo(map)
    resetZIndex()
    $('.loading_tip').hide()
}
//请求单个数据
function reqTypeData(url,index){
    var aUrl = url.replace('https://','').split('/');
    var host = aUrl[0];
    aUrl.splice(0,1);

    var options = { 
    hostname: host, 
    path: '/'+aUrl.join('/'), 
    method: 'GET' 
    }; 
    var sData = '';
    var req = http.request(options, function(res) { 
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) { 
            sData += chunk;
            // console.log('BODY: ' + chunk); 
        }); 
        res.on('end', function () { 
            var jsonData = JSON.parse(sData);
            var arr = jsonData.areas;
            const oDate = transtime(jsonData.time, 24 , 0)
            $('#title_info p').html(oDate)
            creatPolygon(arr,index)
        }); 
    }); 
     
    req.on('error', function(e) { 
        console.log('problem with request: ' + e.message); 
    }); 
     
    // write data to request body 
    req.write('data\n'); 
    req.write('data\n'); 
    req.end();
}
function _typhoonType(type) {
    var obj = {};
    obj.photoSrc = './img/tflj/tf_';
    obj.lineStyle = 'solid';
    obj.isTrue = false;
    switch (type) {
      case 'TD':
        obj.photoSrc += 'rddy.png';
        break;
      case 'TS':
        obj.photoSrc += 'rdfb.png';
        break;
      case 'STS':
        obj.photoSrc += 'qrdfb.png';
        break;
      case 'TY':
        obj.photoSrc += 'tf.png';
        break;
      case 'STY':
        obj.photoSrc += 'qtf.png';
        break;
      case 'SuperTY':
        obj.photoSrc += 'cqtf.png';
        break;
      default:
        obj.photoSrc += 'default.png';
        obj.lineStyle = 'dashed';
        obj.isTrue = true;
        break;
    }
    return obj;
  }
function rain24(flag){
    let index = 0
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-24h降水量图例.png) no-repeat center/contain'})
            $('#title_info h3').html('全国24小时降水预报')
            const oDate = transtime(data[0].time, 24 , 0)
            $('#title_info p').html(oDate)
            $('#title_info').show()
            drawArea(data,index)
        })
    }else{
        $('.pitEg').css('background','')
        $('#title_info').hide()
        map.removeLayer(layers[index])
    }
}	
function rain48(flag){
    let index = 1
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-24h降水量图例.png) no-repeat center/contain'})
            $('#title_info h3').html('全国48小时降水预报')
            const oDate = transtime(data[0].time, 48 , 0)
            $('#title_info p').html(oDate)
            $('#title_info').show()
            drawArea(data,index)
        })
    }else{
        $('.pitEg').css('background','')
        $('#title_info').hide()
        map.removeLayer(layers[index])
    }
}
function rain72(flag){
    let index = 2
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-24h降水量图例.png) no-repeat center/contain'})
            $('#title_info h3').html('全国72小时降水预报')
            const oDate = transtime(data[0].time, 72, 0)
            $('#title_info p').html(oDate)
            $('#title_info').show()
            drawArea(data,index)
        })
    }else{
        $('.pitEg').css('background','')
        $('#title_info').hide()
        map.removeLayer(layers[index])
    }
}
function gaowen(flag){
    let index = 3
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            var _url = data.micaps14_gaowen
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-高温图例.png) no-repeat center/contain'})
            reqTypeData(_url,index)
            $('#title_info h3').html('全国24小时高温预报')
            $('#title_info').show()
            $('.loading_tip').hide()
        })
    }else{
        $('.pitEg').css('background','')
            $('#title_info').hide()
        map.removeLayer(layers[index])
    }
}
function shachen(flag){
    let index = 4
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            var _url = data.micaps14_scyb
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-沙尘图例.png) no-repeat center/contain'})            
            reqTypeData(_url,index)
            $('#title_info h3').html('全国24小时沙尘预报')
            $('#title_info').show()
            $('.loading_tip').hide()
        })
    }else{
        $('.pitEg').css('background','')
        $('#title_info').hide()
        map.removeLayer(layers[index])
    }
}
function wu(flag){
    let index = 5
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('#title_info h3').html('全国24小时雾预报')
            const oDate = transtime(data[0].time, 24 , 0)
            $('#title_info p').html(oDate)
            $('#title_info').show()
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-雾区图例.png) no-repeat center/contain'})                         
            drawArea(data,index)
        })
    }else{
        $('.pitEg').css('background','')   
        $('#title_info').hide()     
        map.removeLayer(layers[index])
    }
}
function mai(flag){
    let index = 6
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('#title_info h3').html('全国24小时霾预报')
            const oDate = transtime(data[0].time, 24 , 0)
            $('#title_info p').html(oDate)
            $('#title_info').show()
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-霾区图例.png) no-repeat center/contain'})                                    
            drawArea(data,index)
        })
    }else{
        $('.pitEg').css('background','')    
        $('#title_info').hide()            
        map.removeLayer(layers[index])
    }
}
function wind(flag){
    let index = 7
    if(flag){
        $('.loading_tip').show()
        $.getJSON( encryURL(urlArr[index], PRIVATE_KEY, APPID ) ,function(data){
            if(data.code === 202){
                $('.loading_tip').hide()
                alert("暂无数据!")
                $('.weather_list li:eq('+index+')').removeClass('act')
                return false
            }
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-大风降温图例.png) no-repeat center/contain'})                                    
            var _url = data.micaps14_dfjw
            reqTypeData(_url,index)
            $('#title_info h3').html('全国24小时大风预报')
            $('#title_info').show()
            $('.loading_tip').hide()
        })
    }else{
        $('.pitEg').css('background','')    
        $('#title_info').hide()                   
        map.removeLayer(layers[index])
    }
}
function typhoon(flag){
    let index = 8
    if(flag){
        $('.loading_tip').show()
        $('.pitEg').css({'background': 'url(img/road/预报图例/预报-台风图例.png) no-repeat center/contain'})                                            
        layers[index] = L.layerGroup()
        var year = (new Date()).getFullYear()
        var url = 'http://scapi.weather.com.cn/weather/typhoon?year=list_' + year + '&test=ncg'
        $.get(url,function(result){
            var aData = JSON.parse(result.substring(result.indexOf('(') + 1, result.lastIndexOf(')'))).typhoonList;
            var uid = aData[0][0]
            var url2 = 'http://scapi.weather.com.cn/weather/typhoon?view=view_' + uid + '&test=ncg'
            $.get(url2,function(result){
                var aData = JSON.parse(result.substring(result.indexOf('(') + 1, result.lastIndexOf(')'))).typhoon;
                var allPionts = aData[8];
                var Pionts = []; //预测点
                for (var i = 0; i < allPionts.length; i++) {
                    var item = allPionts[i]
                    var iconObj = _typhoonType(item[3]);
                    var icon = L.icon({
                        iconUrl: iconObj.photoSrc,
                        iconSize: [10, 10]
                      });
                    var _p = [item[5],item[4]]
                    var marker = L.marker(_p, { icon: icon })
                    layers[index].addLayer(marker)
                    Pionts.push(_p)
                }
                var point_test = Pionts[Pionts.length - 1]
                var marker_typhoon = L.marker(point_test, {
                      icon: L.divIcon({
                        className: 'typhoon_icon', 
                        html: '<div class="rotate"></div>',
                        iconSize: [27, 30],
                        zIndex:-1
                      }),
                      zIndex : -1
                    })
                layers[index].addLayer(marker_typhoon)
                layers[index].addLayer(L.polyline(Pionts,{color:'red'}))
                layers[index].addTo(map)
                map.setView(Pionts[parseInt(Pionts.length/2)],6)
                $('.loading_tip').hide()
            })
        })
    }else{
        $('.pitEg').css({'background': ''})                                            

        map.removeLayer(layers[index])
    }
}
function cur_rain(flag){
    var index = 0
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/实况-降水量图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,1)
            cur_Polygon(data,index,'全国1小时降水实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_rain3(flag){
    var index = 1
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/rain3.png) no-repeat center/contain'})
            const oDate = formatT(data.t,3)
            cur_Polygon(data,index,'全国3小时降水实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_rain6(flag){
    var index = 2
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/rain6.png) no-repeat center/contain'})
            const oDate = formatT(data.t,6)
            cur_Polygon(data,index,'全国6小时降水实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_rain12(flag){
    var index = 3
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-24h降水量图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,12)
            cur_Polygon(data,index,'全国12小时降水实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_rain24(flag){
    var index = 4
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/预报图例/预报-24h降水量图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,24)
            cur_Polygon(data,index,'全国24小时降水实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_wind(flag){
    var index = 5
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/实况-风向风速图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,1)
            cur_Polygon(data,index,'全国逐小时级大风实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_visibility(flag){
    let index = 6
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/实况-能见度图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,1)
            cur_Polygon(data,index,'全国逐小时能见度实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function cur_temp(flag){
    let index = 7
    if(flag){
        $('.loading_tip').show()
        $.getJSON(curUrl[index] ,function(data){
            $('.pitEg').css({'background': 'url(img/road/实况图例/实况-温度图例.png) no-repeat center/contain'})
            const oDate = formatT(data.t,1)
            cur_Polygon(data,index,'全国逐小时气温实况',oDate)
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css('background','')
        map.removeLayer(curLayers[index])
    }
}
function radar_rain(flag){
    let index = 8
    function formateDate(t){
        function addZero(n){return n<10?'0'+n:n;}
        var oDate = new Date(t*1000);
        var h = addZero( oDate.getHours() );//时
        var m = addZero( oDate.getMinutes() ); //分
        var s = addZero( oDate.getSeconds() ); //秒
        return  addZero( oDate.getFullYear() )+'-'+addZero( oDate.getMonth()+1 )+'-'+addZero( oDate.getDate() )+' '+h+':'+m+' 更新'
    }
    if(flag){
        $.getJSON('http://api.tianqi.cn:8070/v1/img.py',(data)=>{
            var _paths = data.radar_img
            if(_paths){
                let _img = _paths[_paths.length - 1]
                let _imgUrl = _img[0]
                let t = _img[1]
                let latlng = _img[2]
                let imageBounds = [[latlng[0], latlng[1]], [latlng[2],latlng[3]]];
                $('.pitEg').css({'background': 'url(img/road/实况图例/minuteRain.png) no-repeat center/contain'})
                curLayers[index] = L.imageOverlay(_imgUrl,imageBounds)
                curLayers[index].addTo(map)
                $('#title_info h3').html('全国雷达回波拼图')
                $('#title_info p').html(formateDate(t))
                $('#title_info').show()
                $('.loading_tip').hide()
            }
        })
    }else{
        $('#title_info').hide()
        $('.pitEg').css({'background': ''})
        map.removeLayer(curLayers[index])
    }
}
module.exports = {
   pre: [rain24,rain48,rain72,gaowen,shachen,wu,mai,wind,typhoon],
   cur: [cur_rain,cur_wind,cur_visibility,cur_temp,cur_rain3,cur_rain6,cur_rain12,cur_rain24,radar_rain]
}