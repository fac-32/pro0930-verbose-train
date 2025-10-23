export function renderCardTemplate(rootElement, data) {
    const tpl = document.getElementById('info-card-tpl');

    // clear or keep: here we clear then append
    rootElement.innerHTML = '';
    const frag = document.createDocumentFragment();

    // deep copy of template clone with all child elements inside template
    const clone = tpl.content.cloneNode(true);
    
    const rawLine = data.line || randomLine();
    const line = sanitizeLineName(rawLine);

    const cardMain = clone.querySelector('.info-card-main');
    cardMain.style.borderLeft = `8px solid var(--${line})`;

    const stopName = clone.querySelector('.stop-name');
    stopName.textContent = trimCommonName(data.commonName);
    
    const lineName = clone.querySelector('.line-name');
    lineName.textContent = `${rawLine} line`;
    lineName.style.backgroundColor = `var(--${line})`;
    lineName.style.color = `var(--${line}-text)`;

    const p14tWrapper = clone.querySelector('.pts-of-interest-wrapper')
    data.placeOfInterest.forEach(point => {
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

export function renderJouenryHeaderTemplate(rootElement, data) {
    const tpl = document.getElementById('journey-header-tpl');

    // clear or keep: here we clear then append
    rootElement.innerHTML = '';
    const frag = document.createDocumentFragment();

    // deep copy of template clone with all child elements inside template
    const clone = tpl.content.cloneNode(true);
    
    const start = data[0];
    const end = data[data.length - 1]

    const startName = trimCommonName(start.commonName);
    const endName = trimCommonName(end.commonName);
    clone.getElementById('end-points-meta').textContent = `${startName} to ${endName}`;

    const stopCount = data.length - 1;
    clone.getElementById('stop-count').textContent = stopCount;
    
    const duration = timeDiffInMin(start.arrivalTime, end.arrivalTime);
    clone.getElementById('duration').textContent = duration;

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

function timeDiffInMin(time1, time2) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;

  return Math.abs(minutes2 - minutes1);
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

function sanitizeLineName(lineName) {
    if (!lineName) return '';
    return lineName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}