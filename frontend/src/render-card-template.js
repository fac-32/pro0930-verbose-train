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
    
    const DUMMY_LINE = randomLine();

    const cardMain = clone.querySelector('.info-card-main');
    cardMain.style.borderLeft = `4px solid var(--${DUMMY_LINE})`;

    const stopName = clone.querySelector('.stop-name');
    stopName.textContent = trimCommonName(data.commonName);
    
    const lineName = clone.querySelector('.line-name');
    lineName.textContent = '(Hard code) data not in dummy';

    const p14tWrapper = clone.querySelector('.pts-of-interest-wrapper')
    data.pointsOfInterest.forEach(point => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'point-of-interest-card';
        const h4 = document.createElement('h4');
        h4.textContent = point.name;
        cardDiv.appendChild(h4);
        const p = document.createElement('p');
        p.textContent = point.description;
        cardDiv.appendChild(p);
        p14tWrapper.appendChild(cardDiv);
    })


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

function randomLine() {
    // this is dummy function to choose a random tube line colour
    // all names in array are real line ids from TFL
    const allLines = ['bakerloo', 'central', 'circle', 'district', 'hammersmith-city', 'jubilee', 'metropolitan', 'northern', 'piccadilly', 'victoria', 'waterloo-city'];
    const i = Math.floor(Math.random() * (allLines.length));
    return allLines[i];
}