let currentIndex = 0
let maxPageShow = 12
let currentPageNum = 1
let article_group = _.chunk(articles, maxPageShow)
let maxPageNum = article_group.length
let buttonNums = 5



function _validateDistributionArray(distributionArray, currentPageNum, maxPageNum) {
    if (currentPageNum - distributionArray[0] <= 0) {
        return false
    }
    if (currentPageNum + distributionArray[1] > maxPageNum) {
        return false
    }
    return true
}

function balanceDistributionArray(distributionArray, currentPageNum, maxPageNum) {
    let originArray = [distributionArray[0], distributionArray[1]]

    function _balanceDistributionArray(distributionArray) {
        if (distributionArray[0] > distributionArray[1]) {
            if (currentPageNum + distributionArray[1] + 1 > maxPageNum) {
                if (_validateDistributionArray(distributionArray, currentPageNum, maxPageNum)) {
                    return distributionArray
                } else {
                    return balanceDistributionArray([originArray[1], originArray[0]], currentPageNum, maxPageNum)
                }
            } else {
                return _balanceDistributionArray([distributionArray[0] - 1, distributionArray[1] + 1], currentPageNum, maxPageNum)
            }
        } else if (distributionArray[0] < distributionArray[1]) {
            if (currentPageNum - distributionArray[0] - 1 <= 0) {
                if (_validateDistributionArray(distributionArray, currentPageNum, maxPageNum)) {
                    return distributionArray
                } else {
                    return balanceDistributionArray([originArray[1], originArray[0]], currentPageNum, maxPageNum)
                }
            } else {
                return _balanceDistributionArray([distributionArray[0] + 1, distributionArray[1] - 1], currentPageNum, maxPageNum)
            }
        } else {
            if (_validateDistributionArray(distributionArray, currentPageNum, maxPageNum)) {
                return distributionArray
            } else {
                return balanceDistributionArray([originArray[1], originArray[0]], currentPageNum, maxPageNum)
            }
        }
    }
    return _balanceDistributionArray(distributionArray)
}

function initPageButton() {
    let currentPageButton = document.getElementById("currentPageButton")
    let pageButtonStepBackward = document.getElementById("pageButtonStepBackward")
    let pageButtonBackward = document.getElementById("pageButtonBackward")

    for (let i = 5; i > 1; i--) {
        let newButton = document.createElement('li')
        newButton.setAttribute("type", "dynamic")
        newButton.classList.add("page-item")
        newButton.innerHTML = `<a role="button" class="page-link" onclick="changePageButton(${i});">${i}</a>`
        currentPageButton.after(newButton)
    }

    // set current button active
    currentPageButton.classList.add("active")
    pageButtonStepBackward.classList.add("disabled")
    pageButtonBackward.classList.add("disabled")
}


function changePage(pageNum) {
    currentIndex = pageNum - 1
    let newArticlesDom = document.createElement('div')
    newArticlesDom.setAttribute("id", "articles")

    for (let article of article_group[currentIndex]) {
        let e = document.createElement('article')
        if (article.subtitle) {
            e.innerHTML = `<a href="${siteUrl}/${article.url}">${article.title}` +
                `<small>${article.subtitle}</small>` +
                `</a><time pubdate="pubdate" datetime="${article.datetime}">${article.locale_date}</time>`
        } else {
            e.innerHTML = `<a href="${siteUrl}/${article.url}">${article.title}` +
                `</a><time pubdate="pubdate" datetime="${article.datetime}">${article.locale_date}</time>`
        }

        newArticlesDom.append(e)
    }

    let articlesDom = document.getElementById("articles")
    articlesDom.replaceWith(newArticlesDom)
}



function changePageButton(pageId) {
    let pageNum = parseInt(pageId)

    if (Number.isNaN(pageNum)) {
        switch (pageId) {
            case 'StepBackward':
                pageNum = 1
                break
            case 'Backward':
                pageNum = currentPageNum - 1
                break

            case 'Forward':
                pageNum = currentPageNum + 1
                break

            case 'StepForward':
                pageNum = maxPageNum
                break
            default:
                console.log('error input')
        }
    }
    // the same page
    if (currentPageNum === pageNum){
        return
    }
    // page num out of range
    if (pageNum <=0){return}
    if (pageNum > maxPageNum){return}

    // accept it
    currentPageNum = pageNum

    // change page content
    changePage(currentPageNum)

    // change page view history
    const nextURL = `/archives.html?page=${currentPageNum}`;
    const nextTitle = '所有博文 - 万泽的博客';
    const nextState = { additionalInformation: 'Updated the URL with JS' };
    window.history.replaceState(nextState, nextTitle, nextURL);

    // change button status
    let currentPageButton = document.getElementById("currentPageButton")
    let pageButtonStepBackward = document.getElementById("pageButtonStepBackward")
    let pageButtonBackward = document.getElementById("pageButtonBackward")
    let pageButtonForward = document.getElementById("pageButtonForward")
    let pageButtonStepForward = document.getElementById("pageButtonStepForward")

    // remove dynamic buttons
    for (let node of document.querySelectorAll("li[type='dynamic']")) {
        node.remove()
    }

    // current button adjust
    currentPageButton.innerHTML = `<a role="button" class="page-link" onclick="changePageButton(${currentPageNum});">${currentPageNum}</a>`

    let distributionArray = balanceDistributionArray([0,buttonNums-1], currentPageNum, maxPageNum)

    console.log(`distributionArray: ${distributionArray} currentPageNum: ${currentPageNum}`)

    // add new buttons before
    for (let i = distributionArray[0]; i > 0 ; i--) {
        let newButton = document.createElement('li')
        newButton.setAttribute("type", "dynamic")
        newButton.classList.add("page-item")
        newButton.innerHTML = `<a role="button" class="page-link" onclick="changePageButton(${currentPageNum - i});">${currentPageNum - i}</a>`
        currentPageButton.before(newButton)
    }
    // add new buttons after
    for (let i = distributionArray[1]; i > 0; i--) {
        let newButton = document.createElement('li')
        newButton.classList.add("page-item")
        newButton.setAttribute("type", "dynamic")
        newButton.innerHTML = `<a role="button" class="page-link" onclick="changePageButton(${currentPageNum + i});">${currentPageNum+i}</a>`
        currentPageButton.after(newButton)
    }

    // set current button active
    currentPageButton.classList.add("active")

    if (distributionArray[0] === 0){
        pageButtonStepBackward.classList.add("disabled")
        pageButtonBackward.classList.add("disabled")
    }else{
        pageButtonStepBackward.classList.remove("disabled")
        pageButtonBackward.classList.remove("disabled")
    }
    if (distributionArray[1] === 0){
        pageButtonStepForward.classList.add("disabled")
        pageButtonForward.classList.add("disabled")
    }else{
        pageButtonStepForward.classList.remove("disabled")
        pageButtonForward.classList.remove("disabled")
    }

}

function getPageParameter() {
    let paras = window.location.search.substring(1);
    let vars = paras.split('&');
    let page = 1;

    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');

        if (pair[0] === 'page') {
            page = parseInt(pair[1]);
        }
    }
    return page;
}

function initAction() {    
    changePage(1)
    initPageButton()

    let page = getPageParameter()

    changePageButton(page)
}


if (document.readyState !== 'loading') {
    initAction()
} else {
    document.addEventListener('DOMContentLoaded', initAction)
}