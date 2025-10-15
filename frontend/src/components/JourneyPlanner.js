const journeyPlannerTemplate = document.createElement('template');
// Note: I've changed IDs to classes to avoid conflicts in the Shadow DOM.
journeyPlannerTemplate.innerHTML = `
    <link rel="stylesheet" href="/src/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <div class="container">
        <h2>TFL Journey Planner</h2>
        <p>Get an AI-powered summary of your next journey.</p>
        <div class="input-group">
            <input type="text" class="from-input" placeholder="From...">
            <input type="text" class="to-input" placeholder="To...">
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
    }

    connectedCallback() {
        this.fromInput = this.shadowRoot.querySelector('.from-input');
        this.toInput = this.shadowRoot.querySelector('.to-input');
        this.submitJourneyButton = this.shadowRoot.querySelector('.submit-journey');
        this.journeyResponseContainer = this.shadowRoot.querySelector('.journey-response-container');
        this.journeyLoader = this.shadowRoot.querySelector('.journey-loader');
        this.mapContainer = this.shadowRoot.querySelector('.map');

        // The Leaflet library (L) is loaded in the main document, so it should be available globally.
        if (typeof L === 'undefined') {
            console.error('Leaflet library not found. Please make sure it is loaded in the main document.');
            return;
        }

        this.submitJourneyButton.addEventListener('click', () => this.fetchAndDisplayJourney());

        // We need to initialize the map after the component is in the DOM.
        // A small delay might be needed for the map container to get its dimensions.
        setTimeout(() => this.initializeMap(), 0);
    }

    initializeMap() {
        // The map container needs a specific height that it's not getting inside the shadow DOM.
        // Let's add a style tag to fix this for now.
        const style = document.createElement('style');
        style.textContent = `
            .map {
                height: 400px;
                margin-top: 1.5rem;
                border-radius: 5px;
                border: 1px solid var(--light-gray);
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
        `;
        this.shadowRoot.appendChild(style);


        this.map = L.map(this.mapContainer).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        this.journeyLayerGroup = L.layerGroup().addTo(this.map);
    }

    displayJourneyOnMap(journeyData) {
        this.journeyLayerGroup.clearLayers();
        if (journeyData && journeyData.length > 0) {
            const latLngs = journeyData.map(point => [point.lat, point.lon]);
            const polyline = L.polyline(latLngs, { color: 'var(--primary-color)' }).addTo(this.journeyLayerGroup);
            this.map.fitBounds(polyline.getBounds());

            const startPoint = journeyData[0];
            const endPoint = journeyData[journeyData.length - 1];
            L.marker([startPoint.lat, startPoint.lon]).addTo(this.journeyLayerGroup)
                .bindPopup(`<b>Start:</b> ${startPoint.commonName}`)
                .openPopup();
            L.marker([endPoint.lat, endPoint.lon]).addTo(this.journeyLayerGroup)
                .bindPopup(`<b>End:</b> ${endPoint.commonName}`);

            // Force the map to re-evaluate its size and redraw.
            // This often fixes rendering issues in complex layouts or web components.
            setTimeout(() => {
                this.map.invalidateSize();
            }, 0);
        }
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
        this.submitJourneyButton.disabled = true;

        try {
            const response = await fetch(`/api/tfl/journey-with-ai?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
            if (!response.ok) throw new Error('Failed to get response from the server.');

            const data = await response.json();
            this.journeyResponseContainer.textContent = data.summary;
            if (data.journey) {
                this.displayJourneyOnMap(data.journey);
            }
        } catch (error) {
            this.journeyResponseContainer.textContent = error.message;
            this.journeyResponseContainer.style.color = 'red';
        } finally {
            this.journeyLoader.style.display = 'none';
            this.submitJourneyButton.disabled = false;
        }
    }
}

customElements.define('journey-planner', JourneyPlanner);