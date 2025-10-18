export function renderCardTemplate(rootElement, data) {
    // console.log(data.commonName)
    const tpl = document.getElementById('info-card-tpl');

    // clear or keep: here we clear then append
    rootElement.innerHTML = '';
    const frag = document.createDocumentFragment();

    // data get passed in is expected to be a object,
    // with properties like commonName, and pointsOfInterest
    
    // deep copy of template clone with all child elements inside template
    const clone = tpl.content.cloneNode(true);
    const stopName = clone.querySelector('.stop-name');
    stopName.textContent = trimCommonName(data.commonName);

    frag.appendChild(clone);
    rootElement.appendChild(frag);
    return rootElement; 
}

function trimCommonName(name) {
    const phrase = ' Underground Station';
    if (name.endsWith(phrase)) {
        return name.slice(0, -phrase.length);
    }
    return name;
}