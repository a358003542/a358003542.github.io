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

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function get_target(data, seq) {
    for (let i = 0; i < data.length; i++) {
        if (arraysEqual(data[i].array, seq)) {
            return data[i];
        }
    }
}


function yaogua() {
    let zhugua = new Array();
    let biangua = new Array();

    let max = 6;
    for (let i = 0; i < max; i++) {
        let temp_array = new Array();
        for (let x = 0; x < 3; x++) {
            let n = getRandomInt(0, 1);
            temp_array.push(n);
        }
        // console.log(temp_array)
        let sum = temp_array.reduce(function (a, b) { return a + b; });
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

    fetch("/data/yaogua.json")
        .then((response) => response.json())
        .then(laterProcess);

    function laterProcess(data) {
        let zhugua_target = get_target(data, zhugua)
        let biangua_target = get_target(data, biangua)

        let yuanwen = document.getElementById("yuanwen");
        yuanwen.innerHTML = "<h3>" + zhugua_target.symbol + zhugua_target.name + "</h3>" + "<dl><dt>经</dt><dd>" + zhugua_target.jing + "</dd><dt>彖</dt><dd>" + zhugua_target.tuan + "</dd><dt>象</dt><dd>" + zhugua_target.xiang + "</dd></dl>";

        let biangua_yuanwen = document.getElementById("biangua-yuanwen");
        biangua_yuanwen.innerHTML = "<h3>" + biangua_target.symbol + biangua_target.name + "</h3>" + "<dl><dt>经</dt><dd>" + biangua_target.jing + "</dd><dt>彖</dt><dd>" + biangua_target.tuan + "</dd><dt>象</dt><dd>" + biangua_target.xiang + "</dd></dl>";

        // store history
        let yaogua_history;
        if ("yaogua_history" in localStorage) {
            yaogua_history = JSON.parse(localStorage.yaogua_history);
        } else {
            yaogua_history = [];
        }

        const MAX_LENTH = 6;
        let len = yaogua_history.push([new Date(), zhugua_target.name, biangua_target.name]);

        while (len > MAX_LENTH) {
            yaogua_history.shift();
            len = yaogua_history.length;
        }

        localStorage.yaogua_history = JSON.stringify(yaogua_history);

    }

}


function check_history() {
    let yaogua_history;
    if ("yaogua_history" in localStorage) {
        yaogua_history = JSON.parse(localStorage.yaogua_history);
    } else {
        yaogua_history = [];
    }

    let table_html = '<table class="table"><thead><tr><td>预测时间</td><td>主卦</td><td>变卦</td></tr></thead><tbody>'

    for (let item of yaogua_history.reverse()) {
        let time_str = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");
        table_html += `<tr><th>${time_str}</th><th>${item[1]}</th><th>${item[2]}</th></tr>`;
    }
    table_html += '</tbody></table>'

    let history_pad = document.getElementById('history');
    history_pad.innerHTML = table_html;
}
