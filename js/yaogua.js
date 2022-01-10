//http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

var BAGUA = {
    '乾': Array(1, 1, 1),
    '兑': Array(1, 1, 0),
    '离': Array(1, 0, 1),
    '震': Array(1, 0, 0),
    '巽': Array(0, 1, 1),
    '坎': Array(0, 1, 0),
    '艮': Array(0, 0, 1),
    '坤': Array(0, 0, 0),
}

function get_target(data, seq) {
    for (var i = 0; i < data.length; i++) {
        if (arraysEqual(data[i].array, seq)) {
            return data[i];
        }
    }
}


function yaogua() {
    var zhugua = new Array();
    var biangua = new Array();

    var max = 6;
    for (var i = 0; i < max; i++) {
        var temp_array = new Array();
        for (var x = 0; x < 3; x++) {
            var n = getRandomInt(0, 1);
            temp_array.push(n);
        }
        // console.log(temp_array)
        var sum = temp_array.reduce(function (a, b) { return a + b; });
        if (sum == 3) {
            zhugua.push(1);
            biangua.push(0);
        }
        else if (sum == 2) {
            zhugua.push(1);
            biangua.push(1);
        }
        else if (sum == 1) {
            zhugua.push(0);
            biangua.push(0);
        }
        else if (sum == 0) {
            zhugua.push(0);
            biangua.push(1);
        }
    }
    console.log('zhugua is ' + zhugua);
    console.log('biangua is ' + biangua);

    $.getJSON("/data/yaogua.json", laterProcess);

    function laterProcess(data) {
        var zhugua_target = get_target(data, zhugua)
        console.log('found zhugua: ' + zhugua_target)

        var biangua_target = get_target(data, biangua)
        console.log('found biangua: ' + biangua_target)

        var yuanwen = $("#yuanwen");
        console.log(yuanwen)
        yuanwen[0].innerHTML = "<h3>" + zhugua_target.symbol + zhugua_target.name + "</h3>" + "<dl><dt>经</dt><dd>" + zhugua_target.jing + "</dd><dt>彖</dt><dd>" + zhugua_target.tuan + "</dd><dt>象</dt><dd>" + zhugua_target.xiang + "</dd></dl>";

        var biangua_yuanwen = $("#biangua-yuanwen");
        console.log(biangua_yuanwen)
        biangua_yuanwen[0].innerHTML = "<h3>" + biangua_target.symbol + biangua_target.name + "</h3>" + "<dl><dt>经</dt><dd>" + biangua_target.jing + "</dd><dt>彖</dt><dd>" + biangua_target.tuan + "</dd><dt>象</dt><dd>" + biangua_target.xiang + "</dd></dl>";
    
        // store history
        var yaogua_history;
        if ("yaogua_history" in localStorage) {
            yaogua_history = JSON.parse(localStorage.yaogua_history);
        } else {
            yaogua_history = [];
        }
    
        const MAX_LENTH = 8;
        var len = yaogua_history.push([new Date().toJSON(), zhugua_target.name, biangua_target.name]);
        while (len > MAX_LENTH) {
            yaogua_history.shift();
            len = yaogua_history.length;
        }
    
        localStorage.yaogua_history = JSON.stringify(yaogua_history);
    
    }

}

function check_history(){
    var yaogua_history;
    if ("yaogua_history" in localStorage) {
        yaogua_history = JSON.parse(localStorage.yaogua_history);
    } else {
        yaogua_history = [];
    }

    var table_html = '<table class="table"><thead><tr><td>预测时间</td><td>主卦</td><td>变卦</td></tr></thead><tbody>'

    for (let item of yaogua_history.reverse()){
        let time_str = new Date(item[0]).toISOString()
        time_str = time_str.substring(0, time_str.length - 5);
        table_html += `<tr><th>${time_str}</th><th>${item[1]}</th><th>${item[2]}</th></tr>` ;
    }
    table_html += '</tbody></table>'

    $('#history').html(table_html);
}