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



var LIUSHISIGUA = {'乾': [1, 1, 1, 1, 1, 1], '坤': [0, 0, 0, 0, 0, 0],
               '屯': [0, 1, 0, 0, 0, 1], '蒙': [1, 0, 0, 0, 1, 0],
               '需': [0, 1, 0, 1, 1, 1], '讼': [1, 1, 1, 0, 1, 0],
               '师': [0, 0, 0, 0, 1, 0], '比': [0, 1, 0, 0, 0, 0],
               '小畜': [1, 1, 0, 1, 1, 1], '履': [1, 1, 1, 0, 1, 1],
               '泰': [0, 0, 0, 1, 1, 1], '否': [1, 1, 1, 0, 0, 0],
               '同人': [1, 1, 1, 1, 0, 1], '大有': [1, 0, 1, 1, 1, 1],
               '谦': [0, 0, 0, 1, 0, 0], '豫': [0, 0, 1, 0, 0, 0],
               '随': [0, 1, 1, 0, 0, 1], '蛊': [1, 0, 0, 1, 1, 0],
               '临': [0, 0, 0, 0, 1, 1], '观': [1, 1, 0, 0, 0, 0],
               '噬嗑': [1, 0, 1, 0, 0, 1], '贲': [1, 0, 0, 1, 0, 1],
               '剥': [1, 0, 0, 0, 0, 0], '复': [0, 0, 0, 0, 0, 1],
               '无妄': [1, 1, 1, 0, 0, 1], '大畜': [1, 0, 0, 1, 1, 1],
               '颐': [1, 0, 0, 0, 0, 1], '大过': [0, 1, 1, 1, 1, 0],
               '坎': [0, 1, 0, 0, 1, 0], '离': [1, 0, 1, 1, 0, 1],
               '咸': [0, 1, 1, 1, 0, 0], '恒': [0, 0, 1, 1, 1, 0],
               '遁': [1, 1, 1, 1, 0, 0], '大壮': [0, 0, 1, 1, 1, 1],
               '晋': [1, 0, 1, 0, 0, 0], '明夷': [0, 0, 0, 1, 0, 1],
               '家人': [1, 1, 0, 1, 0, 1], '睽': [1, 0, 1, 0, 1, 1],
               '蹇': [0, 1, 0, 1, 0, 0], '解': [0, 0, 1, 0, 1, 0],
               '损': [1, 0, 0, 0, 1, 1], '益': [1, 1, 0, 0, 0, 1],
               '夬': [0, 1, 1, 1, 1, 1], '姤': [1, 1, 1, 1, 1, 0],
               '萃': [0, 1, 1, 0, 0, 0], '升': [0, 0, 0, 1, 1, 0],
               '困': [0, 1, 1, 0, 1, 0], '井': [0, 1, 0, 1, 1, 0],
               '革': [0, 1, 1, 1, 0, 1], '鼎': [1, 0, 1, 1, 1, 0],
               '震': [0, 0, 1, 0, 0, 1], '艮': [1, 0, 0, 1, 0, 0],
               '渐': [1, 1, 0, 1, 0, 0], '归妹': [0, 0, 1, 0, 1, 1],
               '丰': [0, 0, 1, 1, 0, 1], '旅': [1, 0, 1, 1, 0, 0],
               '巽': [1, 1, 0, 1, 1, 0], '兑': [0, 1, 1, 0, 1, 1],
               '涣': [1, 1, 0, 0, 1, 0], '节': [0, 1, 0, 0, 1, 1],
               '中孚': [1, 1, 0, 0, 1, 1], '小过': [0, 0, 1, 1, 0, 0],
               '既济': [0, 1, 0, 1, 0, 1], '未济': [1, 0, 1, 0, 1, 0]}

var FUXI_GUA_LIST = ['鼎', '恒', '巽', '井', '蛊', '升', '讼', '困', '未济', '解', '涣',
                 '坎', '蒙', '师', '遁', '咸', '旅', '小过', '渐', '蹇', '艮', '谦',
                 '否', '萃', '晋', '豫', '观', '比', '剥', '坤', '复', '颐', '屯',
                 '益', '震', '噬嗑', '随', '无妄', '明夷', '贲', '既济', '家人',
                 '丰', '离', '革', '同人', '临', '损', '节', '中孚', '归妹', '睽',
                 '兑', '履', '泰', '大畜', '需', '小畜', '大壮', '大有', '夬', '乾',
                 '姤', '大过']

function is_in_array(array, element){
    if (array.indexOf(element) === -1){
        return false;
    }else{
        return true;
    }
}


var FUXI_LIUSHI = new Array()

for (let name of FUXI_GUA_LIST){
    if (! is_in_array(['乾','坤','坎','离'], name)){
        FUXI_LIUSHI.push(LIUSHISIGUA[name]);
    }
}



function get_target(data,seq){
    for (var i=0;i<data.length;i++){
        if (arraysEqual(data[i].array,seq)){
            return data[i];
        }
    }
}


function get_next_fuxi_liushi_gua(gua){
    var flag = false;
    var index = 0;

    while (true) {
        if (flag){
            return FUXI_LIUSHI[index];
        }

        target = FUXI_LIUSHI[index]
        if (arraysEqual(target, gua)){
            flag = true;
        }

        index++;

        if (index === 60){
            index = 0;
        }
    }
}


function change_yao(gua, num){
    // num = 1 yao  -- > index = 5
    var [...new_gua] = gua

    if (new_gua[6-num] === 1){
        new_gua[6-num] = 0;
    }else if (new_gua[6-num] === 0) {
        new_gua[6-num] = 1
    }
                
    return new_gua;
}


function hjjs(year){
    // calc yun
    var calc_start_year = -57;

    var yun_num = parseInt((year - (calc_start_year)) / (360 * 6)) ; // 运卦到下面第几个

    var yun_gua_base = [0, 1, 1, 1, 1, 0];

    for (let i=0; i < yun_num; i++){
        yun_gua_base = get_next_fuxi_liushi_gua(yun_gua_base);
     }

    var yun_yao_num = parseInt(((year - (-57)) % (360 * 6)) / 360) + 1  ;// 第几爻动

    var yun_gua = change_yao(yun_gua_base, yun_yao_num);

    // calc shi
    var calc_start_year = calc_start_year + (yun_num * 360 * 6) + (yun_yao_num - 1) * 360 + 1;

    var shi_yao_num = parseInt((year - calc_start_year) / 60) + 1;

    var shi_gua = change_yao(yun_gua, shi_yao_num);

    // calc year
    var calc_start_year = calc_start_year + (60 * (shi_yao_num - 1));

    var year_num = (year - calc_start_year);

    var year_gua = shi_gua;

    for (let i=0; i < year_num; i++){
        year_gua = get_next_fuxi_liushi_gua(year_gua);
     }

     console.log(`公元${year}年的皇极经世卦象是：
     运卦 ${get_gua_name(yun_gua)}
     世卦 ${get_gua_name(shi_gua)}
     年卦 ${get_gua_name(year_gua)}
     `)

    return `<p>公元${year}年的皇极经世卦象是：</p> 
    <p>运卦 ${get_gua_name(yun_gua)}</p> 
    <p>世卦 ${get_gua_name(shi_gua)}</p> 
    <p>年卦 ${get_gua_name(year_gua)}</p> 
    `
}


function get_gua_name(gua){
    for (let name in LIUSHISIGUA){
        if (arraysEqual(gua, LIUSHISIGUA[name])){
            return name + '卦';
        }            
    }
}


function hjjs_html(){
    var year = $('input[name=year]').val();
    
    if (!year){
        alert('请输入年份！');
        return ;
    }
    
    var year = parseInt(year);
    var content = hjjs(year);

    $('#result').html(content);
}