export function renderCardTemplate(rootElement, data) {
    const tpl = document.getElementById('info-card-tpl');

    // clear or keep: here we clear then append
    rootElement.innerHTML = '';
    const frag = document.createDocumentFragment();

    // deep copy of template clone with all child elements inside template
    const clone = tpl.content.cloneNode(true);
    
    const DUMMY_LINE = randomLine();

    const cardMain = clone.querySelector('.info-card-main');
    cardMain.style.borderLeft = `4px solid var(--${DUMMY_LINE})`;

    const stopName = clone.querySelector('.stop-name');
    stopName.textContent = trimCommonName(data.commonName);
    
    const lineName = clone.querySelector('.line-name');
    lineName.textContent = `${DUMMY_LINE} line`;
    lineName.style.backgroundColor = `var(--${DUMMY_LINE})`;
    lineName.style.color = `var(--${DUMMY_LINE}-text)`;

    const p14tWrapper = clone.querySelector('.pts-of-interest-wrapper')
    // data.pointsOfInterest.forEach(point => {
    //     const cardDiv = document.createElement('div');
    //     cardDiv.className = 'point-of-interest-card';
    //     const h4 = document.createElement('h4');
    //     h4.textContent = point.name;
    //     cardDiv.appendChild(h4);
    //     const p = document.createElement('p');
    //     p.textContent = point.description;
    //     cardDiv.appendChild(p);
    //     p14tWrapper.appendChild(cardDiv);
    // })
    for (let i = 0; i < 4; i++) {
        // dummy render becasue real data doesn't have points-of-interest property yet
        const cardDiv = document.createElement('div');
        cardDiv.className = 'point-of-interest-card';
        const h4 = document.createElement('h4');
        h4.textContent = `${trimCommonName(data.commonName)} point of interest ${i} name`;
        cardDiv.appendChild(h4);
        const p = document.createElement('p');
        p.textContent = `${trimCommonName(data.commonName)} point of interest ${i} description`;
        cardDiv.appendChild(p);
        p14tWrapper.appendChild(cardDiv);
    }

    frag.appendChild(clone);
    rootElement.appendChild(frag);
    return rootElement; 
}

export function renderJouenryHeaderTemplate(rootElement, data) {
    const tpl = document.getElementById('journey-header-tpl');

    // clear or keep: here we clear then append
    rootElement.innerHTML = '';
    const frag = document.createDocumentFragment();

    // deep copy of template clone with all child elements inside template
    const clone = tpl.content.cloneNode(true);
    
    const startName = trimCommonName(data[0].commonName);
    const endName = trimCommonName(data[data.length - 1].commonName);
    clone.getElementById('end-points-meta').textContent = `${startName} to ${endName}`;

    const stopCount = data.length;
    clone.getElementById('stop-count').textContent = stopCount;
    
    clone.getElementById('duration').textContent = 'MAGIC';

    const lineCount = new Set(data.map(stop => stop.line));
    if (lineCount.length === 1) {
        clone.getElementById('line').textContent = lineCount[0];
    } else {
        let concatNames = '';
        lineCount.forEach(line => { concatNames += (`${line} → `) });
        clone.getElementById('line').textContent = concatNames.slice(0, concatNames.length - 3);
    }

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