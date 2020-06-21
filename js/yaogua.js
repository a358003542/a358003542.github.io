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
    '乾' : Array(1,1,1),
    '兑' : Array(1,1,0),
    '离' : Array(1,0,1),
    '震' : Array(1,0,0),
    '巽' : Array(0,1,1),
    '坎' : Array(0,1,0),
    '艮' : Array(0,0,1),
    '坤' : Array(0,0,0),
}

function get_target(data,seq){
    for (var i=0;i<data.length;i++){
        if (arraysEqual(data[i].array,seq)){
            return data[i];
        }
    }
}


function yaogua(){
    var zhugua = new Array();
    var biangua = new Array();

    var max = 6;
    for (var i =0 ;i < max ; i++){
        var temp_array = new Array();
        for (var x=0;x<3;x++){
            var n = getRandomInt(0,1);
            temp_array.push(n);
        }
       // console.log(temp_array)
        var sum = temp_array.reduce(function(a,b){return a+b;});
        if (sum == 3){
            zhugua.push(1);
            biangua.push(0);
        }
        else if (sum ==2){
            zhugua.push(1);
            biangua.push(1);
        }
        else if (sum == 1){
            zhugua.push(0);
            biangua.push(0);
        }
        else if (sum == 0){
            zhugua.push(0);
            biangua.push(1);
        }
}
    console.log('zhuagua is ' + zhugua);
    console.log('biangua is ' + biangua);

    $.getJSON("/data/yaogua.json",laterProcess);

    function laterProcess(data){
        var target = get_target(data,zhugua)
        console.log('found target: ' + target)

        var yuanwen = $("#yuanwen");
        console.log(yuanwen)
        yuanwen[0].innerHTML = "<h3>" + target.symbol + target.name + "</h3>" + "<dl><dt>经</dt><dd>" + target.jing + "</dd><dt>彖</dt><dd>" + target.tuan + "</dd><dt>象</dt><dd>" + target.xiang + "</dd></dl>";

        var jiegua = $("#jiegua");
        jiegua[0].innerHTML = "<h3>" + target.symbol + target.name + "</h3>" +target.jie;

        // biangua
        var target = get_target(data,biangua)
        console.log('found biangua: ' + target)

        var yuanwen = $("#biangua-yuanwen");
        console.log(yuanwen)
        yuanwen[0].innerHTML = "<h3>" + target.symbol + target.name + "</h3>" + "<dl><dt>经</dt><dd>" + target.jing + "</dd><dt>彖</dt><dd>" + target.tuan + "</dd><dt>象</dt><dd>" + target.xiang + "</dd></dl>";

        var jiegua = $("#biangua-jiegua");
        jiegua[0].innerHTML = "<h3>" + target.symbol + target.name + "</h3>" +target.jie;


    }
}



/*
☰（乾 qián ㄑㄧㄢˊ）
☱（兑 duì ㄉㄨㄟˋ）
☲（离 lí ㄌㄧˊ）
☳（震 zhèn ㄓㄣˋ）
☴（巽 xùn ㄒㄩㄣˋ）
☵（坎 kǎn ㄎㄢˇ）
☶（艮 gèn ㄍㄣˋ）
☷（坤 kūn ㄎㄨㄣ）
*/

