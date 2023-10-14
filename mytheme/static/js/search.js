function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');

    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
    }
}

const simpleSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

function initSearch() {
    fetch("/search_content.json")
        .then((response) => response.json())
        .then((data) => {
            window.search_content = data

            window.index = lunr(function () {
                this.use(lunr.multiLanguage('en', 'zh'));
                this.ref('url')
                this.field('title', { boost: 2 })
                this.field('text')

                for (let url in data){
                    let doc = data[url]
                    this.add(doc)
                }
            })

            let searchTerm = getQueryVariable('q');

            if (searchTerm) {
                if (searchTerm.indexOf('*') > 0){
                    new_search_term = searchTerm
                } else{
                    new_search_term = [...simpleSegmenter.segment(searchTerm)]
                    .filter((segment) => segment.isWordLike)
                    .map((item) => (item.segment))
                    .join(' ')
                }

                do_search(new_search_term)
            }
        });
}




function do_search(term) {
    let elem_search_content = document.getElementById('search_content')

    if (term) {
        let results = window.index.search(term);

        if (results.length > 0) {
            let div_count = document.createElement('div')
            div_count.id = 'search_results_count'
            div_count.textContent = `Search Result for '${term}', Found ${results.length} results.`
            elem_search_content.appendChild(div_count)


            for (let i = 0; i < results.length; i++) {
                let ref = results[i]['ref'];
                let url = ref;
                let title = window.search_content[ref]['title'];
                let text = window.search_content[ref]['text'].substring(0, 300) + '...';

                let div_search_content_title = document.createElement('div')
                div_search_content_title.className = 'search_content_title'
                div_search_content_title.innerHTML = `<a href="${url}">${title}</a>`
                elem_search_content.appendChild(div_search_content_title)

                let div_search_content_text = document.createElement('div')
                div_search_content_text.className = 'search_content_text'
                
                div_search_content_text.innerHTML = `${text}`
                elem_search_content.appendChild(div_search_content_text)

            }

            let markjs = new Mark(elem_search_content);
            markjs.mark(term.split(' '));
        } else {
            elem_search_content.innerHTML = "<p>No results found...</p>";
        }
    }
    return false;
}



if (document.readyState !== 'loading') {
    initSearch()
} else {
    document.addEventListener('DOMContentLoaded', initSearch)
}
