function add_table_class() {
    for (let e of document.querySelectorAll('table')) {
        e.classList.add('table', 'table-striped')
    }
}


function add_footnote_support() {
    for (let e of document.querySelectorAll('.footnote-ref')) {
        
        let footnote_index = e.textContent
        //console.log(footnote_index);

        let footnote_text_node = document.getElementById(`fn${footnote_index}`)
        let footnote_text = ''

        if (!footnote_text_node) {
            footnote_text_node = document.getElementById(`fn:${footnote_index}`)
        }

        if (!footnote_text_node) {
            console.log('can not found the target footnote content.')
            return -1;
        } else {
            footnote_text = footnote_text_node.textContent;
        }

        e.innerHTML  = `<sup>注${footnote_index}</sup>`
        e.setAttribute("data-bs-toggle", "popover")
        e.setAttribute("data-bs-trigger", "focus")
        e.setAttribute("data-bs-content", `${footnote_text}`)
        e.setAttribute("role", "button")
        e.setAttribute("tabindex", "0")
        e.setAttribute("data-bs-placement", "bottom")
        e.removeAttribute("href")
    }

    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        let popover =  new bootstrap.Popover(popoverTriggerEl, {})
    })
}

function initArticle() {
    add_table_class()
    add_footnote_support()
}

if (document.readyState !== 'loading') {
    initArticle()
} else {
    document.addEventListener('DOMContentLoaded', initArticle)
}





