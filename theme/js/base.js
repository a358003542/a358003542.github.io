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

    

function footnote_popover(){
    $('.footnote-ref').each(function(){
        let footnote_index = $(this).text();
        //console.log(footnote_index);

        let footnote_text_node = document.getElementById(`fn${footnote_index}`);
        let footnote_text = '';

        if (!footnote_text_node){
            footnote_text_node = document.getElementById(`fn:${footnote_index}`);
        }

        if (!footnote_text_node){
            console.log('can not found the target footnote content.');
            return -1;
        }else{
            footnote_text = footnote_text_node.textContent;
        }

        $('sup',this).remove();
        $(this).attr('data-bs-toggle','popover');
        $(this).html(`<sup>注${footnote_index}</sup>`);
        $(this).attr('data-bs-trigger','focus');
        $(this).attr('data-bs-content',`${footnote_text}`);
        $(this).attr('role','button');
        $(this).attr('tabindex','0');
        $(this).removeAttr('href');
        $(this).attr('data-bs-placement',"bottom");
    
    })
    
    options = {};
    $('.footnote-ref').popover(options);
}


$(document).ready(function () {
    adjust_search_width();
    adjust_markdown_css();
    footnote_popover();
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