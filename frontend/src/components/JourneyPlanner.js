const journeyPlannerTemplate = document.createElement('template');
journeyPlannerTemplate.innerHTML = `
    <style>
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
        :host {
            --primary-color: #4CAF50;
            --secondary-color: #2E7D32;
            --light-gray: #bdc3c7;
            --pitstop-color: #FF9800; /* Orange for pitstops */
        }
        .map {
            height: 400px;
            margin-top: 1.5rem;
            border-radius: 5px;
            border: 1px solid var(--light-gray);
            background-color: #f0f0f0; /* A fallback background */
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1.5rem auto;
            display: none; /* Hidden by default */
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .container .submit-journey {
            background-color: var(--pitstop-color);
            color: #333;
        }

        /* SVG Animation Styles */
        .journey-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-path 3s ease-in-out forwards;
        }

        @keyframes draw-path {
            to {
                stroke-dashoffset: 0;
            }
        }

        .pitstop-circle {
            animation: pop-in-radius 0.5s ease-out forwards;
        }

        @keyframes pop-in-radius {
            from {
                r: 0;
                opacity: 0;
            }
            to {
                r: 5;
                opacity: 1;
            }
        }

        .response-container {
            display: none; /* Hidden by default */
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: left;
            white-space: pre-wrap;
        }
    </style>
    <link rel="stylesheet" href="/src/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <div class="container">
        <h2>TFL Journey Planner</h2>
        <p>Get an AI-powered summary of your next journey.</p>
        <div class="input-group">
            <label for="from-input" class="sr-only">From</label>
            <input type="text" id="from-input" class="from-input" placeholder="From...">
            <label for="to-input" class="sr-only">To</label>
            <input type="text" id="to-input" class="to-input" placeholder="To...">
        </div>
        <button class="submit-journey">Get Journey Summary</button>
        <div class="map"></div>
        <div class="loader journey-loader"></div>
        <div class="response-container journey-response-container"></div>
    </div>
`;

class JourneyPlanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(journeyPlannerTemplate.content.cloneNode(true));
        this.journeyData = null;
    }

    connectedCallback() {
        this.fromInput = this.shadowRoot.querySelector('#from-input');
        this.toInput = this.shadowRoot.querySelector('#to-input');
        this.submitJourneyButton = this.shadowRoot.querySelector('.submit-journey');
        this.journeyResponseContainer = this.shadowRoot.querySelector('.journey-response-container');
        this.journeyLoader = this.shadowRoot.querySelector('.journey-loader');
        this.mapContainer = this.shadowRoot.querySelector('.map');

        if (typeof L === 'undefined') {
            console.error('Leaflet library not found.');
            return;
        }

        this.submitJourneyButton.addEventListener('click', () => this.fetchAndDisplayJourney());
        setTimeout(() => this.initializeMap(), 0);
    }

    initializeMap() {
        this.map = L.map(this.mapContainer).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        
        this.svgLayer = L.svg();
        this.svgLayer.addTo(this.map);

        this.journeyLayerGroup = L.layerGroup().addTo(this.map);

        this.map.on('moveend', () => this._drawJourneyPath());
    }

    displayJourneyOnMap(journeyData) {
        this.journeyLayerGroup.clearLayers();
        if (this.svgLayer && this.svgLayer._container) {
            this.svgLayer._container.innerHTML = '';
        }

        this.journeyData = journeyData;

        if (this.journeyData && this.journeyData.length > 0) {
            const latLngs = this.journeyData.map(point => [point.lat, point.lon]);
            const bounds = L.latLngBounds(latLngs);
            this.map.fitBounds(bounds);

            const startPoint = this.journeyData[0];
            const endPoint = this.journeyData[this.journeyData.length - 1];
            L.marker([startPoint.lat, startPoint.lon]).addTo(this.journeyLayerGroup)
                .bindPopup(`<b>Start:</b> ${startPoint.commonName}`)
                .openPopup();
            L.marker([endPoint.lat, endPoint.lon]).addTo(this.journeyLayerGroup)
                .bindPopup(`<b>End:</b> ${endPoint.commonName}`);

            setTimeout(() => {
                this.map.invalidateSize();
                this._drawJourneyPath();
            }, 100);
        }
    }

    _drawJourneyPath() {
        if (!this.journeyData || !this.svgLayer) return;

        const svg = this.svgLayer._container;
        svg.innerHTML = '';

        const points = this.journeyData.map(p => this.map.latLngToLayerPoint(L.latLng(p.lat, p.lon)));
        const pathString = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathString);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--primary-color)');
        path.setAttribute('stroke-width', 5);

        svg.appendChild(path);

        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.classList.add('journey-path');

        const pitstopColor = getComputedStyle(this).getPropertyValue('--pitstop-color').trim() || '#FF9800';

        this.journeyData.forEach((point, index) => {
            const p = this.map.latLngToLayerPoint(L.latLng(point.lat, point.lon));
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            
            circle.setAttribute('cx', p.x);
            circle.setAttribute('cy', p.y);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', pitstopColor);
            
            circle.classList.add('pitstop-circle');
            circle.style.animationDelay = `${0.5 + index * 0.1}s`; 

            svg.appendChild(circle);
        });
    }

    async fetchAndDisplayJourney() {
        const from = this.fromInput.value;
        const to = this.toInput.value;

        if (!from || !to) {
            alert('Please enter both a starting point and a destination.');
            return;
        }

        this.journeyLoader.style.display = 'block';
        this.journeyResponseContainer.innerHTML = '';
        this.journeyResponseContainer.style.display = 'none';
        this.submitJourneyButton.disabled = true;

        try {
            const response = await fetch(`/api/tfl/journey-with-ai?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
            if (!response.ok) throw new Error('Failed to get response from the server.');

            const data = await response.json();
            this.journeyResponseContainer.textContent = data.summary;
            this.journeyResponseContainer.style.display = 'block';
            if (data.journey) {
                this.displayJourneyOnMap(data.journey);
            }
        } catch (error) {
            this.journeyResponseContainer.textContent = error.message;
            this.journeyResponseContainer.style.color = 'red';
            this.journeyResponseContainer.style.display = 'block';
        } finally {
            this.journeyLoader.style.display = 'none';
            this.submitJourneyButton.disabled = false;
        }
    }
}

customElements.define('journey-planner', JourneyPlanner);