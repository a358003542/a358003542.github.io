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
    adjust_markdown_css();
    footnote_popover();
});



