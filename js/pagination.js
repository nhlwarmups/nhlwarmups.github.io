const maxItems = 12;
let startIndex;
let endIndex;

export function filterPage(jerseys, currPage) {
    startIndex = (currPage - 1) * maxItems;
    endIndex = startIndex + maxItems;
    return jerseys.slice(startIndex, endIndex);
}

function calcPages(jerseys) {
  return Math.ceil(jerseys.length / maxItems);
}

export function loadPages(jerseys, currPage) {
    var container = $('#page-container').empty();

    if (jerseys.length > 0) {
        $('#result-num').html(`${startIndex+1} - ${Math.min(endIndex,jerseys.length)} of ${jerseys.length}`);
        const numPages = calcPages(jerseys);

        var prev = document.createElement('li');
        prev.className = "page-item";
        prev.id = "prev-button";
        prev.innerHTML = `<span aria-hidden="true">&lt;</span>
            <span class="sr-only">Previous</span>`;
        container.append(prev);
    
        if (currPage == 1) {
            $('#prev-button').attr('id', 'prev-button-disabled');
        }
    
        for (var i = 0; i < numPages; i++) {
            var page = document.createElement('li');
            if (i == (currPage - 1)) {
                page.className = "page-item num active";
            } else {
                page.className = "page-item num";
            }
            page.innerHTML = `<span> ${i+1} </span>`;
    
            container.append(page);
        }
    
        var next = document.createElement('li');
        next.className = "page-item";
        next.id = "next-button";
        next.innerHTML = `<span aria-hidden="true">&gt;</span>
            <span class="sr-only">Next</span>`;
        container.append(next);
    
        if (currPage == numPages) {
            $('#next-button').attr('id', 'next-button-disabled');
        }    
    } else {
        $('#result-num').html(`0`);
    }
}
