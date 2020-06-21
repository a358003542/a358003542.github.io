function validateForm(query) {
    return (query.length > 0);
}

function adjust_search_width() {
    var w = document.documentElement.clientWidth;
    if ((w > 755) && (w < 975)) {
        plus_width = w - 755;
        $('.navbar-form .form-control').outerWidth(210 + plus_width);
    } else if (w >= 975) {
        $('.navbar-form .form-control').outerWidth(210 + 220);
    } else if (w <= 755) {
        $('.navbar-form .form-control').css('width', '100%')
    }
}

function adjust_markdown_css(){
    $('table').addClass('table table-striped');
}

$(document).ready(function () {
    adjust_search_width();
    adjust_markdown_css();
});

window.onresize = function () {
    adjust_search_width();
};

$(function () {
    //点击回到顶部的元素
    $("#gotop").click(function (e) {
        //以1秒的间隔返回顶部
        $('html').animate({scrollTop: 0}, "fast");
    });
});