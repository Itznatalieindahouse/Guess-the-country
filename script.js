// Game state
let currentCountry = null;
let score = 0;
let guessesLeft = 3;
let gameActive = false;
let countries = [];
let currentGuess = 1;

// DOM elements
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const prompt = document.getElementById('prompt');
const scoreElement = document.getElementById('score');
const guessesElement = document.getElementById('guesses');
const feedback = document.getElementById('feedback');
const mapWrapper = document.getElementById('mapWrapper');
const worldMap = document.getElementById('worldMap');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetViewBtn = document.getElementById('resetView');

// Map state
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let isZooming = false;
let originalViewBox = null;

// Country name mapping
const countryNames = {
    'AD': 'Andorra', 'AE': 'United Arab Emirates', 'AF': 'Afghanistan', 'AG': 'Antigua and Barbuda',
    'AI': 'Anguilla', 'AL': 'Albania', 'AM': 'Armenia', 'AO': 'Angola', 'AR': 'Argentina',
    'AS': 'American Samoa', 'AT': 'Austria', 'AU': 'Australia', 'AW': 'Aruba', 'AX': 'Aland Islands',
    'AZ': 'Azerbaijan', 'BA': 'Bosnia and Herzegovina', 'BB': 'Barbados', 'BD': 'Bangladesh',
    'BE': 'Belgium', 'BF': 'Burkina Faso', 'BG': 'Bulgaria', 'BH': 'Bahrain', 'BI': 'Burundi',
    'BJ': 'Benin', 'BL': 'Saint Barthelemy', 'BN': 'Brunei Darussalam', 'BO': 'Bolivia',
    'BM': 'Bermuda', 'BQ': 'Bonaire, Saint Eustachius and Saba', 'BR': 'Brazil', 'BS': 'Bahamas',
    'BT': 'Bhutan', 'BW': 'Botswana', 'BY': 'Belarus', 'BZ': 'Belize', 'CA': 'Canada',
    'CD': 'Democratic Republic of the Congo', 'CF': 'Central African Republic', 'CG': 'Republic of the Congo',
    'CH': 'Switzerland', 'CI': 'Ivory Coast', 'CL': 'Chile', 'CM': 'Cameroon', 'CN': 'China',
    'CO': 'Colombia', 'CR': 'Costa Rica', 'CU': 'Cuba', 'CV': 'Cape Verde', 'CW': 'Curacao',
    'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 'DJ': 'Djibouti', 'DK': 'Denmark',
    'DM': 'Dominica', 'DO': 'Dominican Republic', 'DZ': 'Algeria', 'EC': 'Ecuador', 'EE': 'Estonia',
    'EG': 'Egypt', 'EH': 'Western Sahara', 'ER': 'Eritrea', 'ES': 'Spain', 'ET': 'Ethiopia',
    'FI': 'Finland', 'FJ': 'Fiji', 'FK': 'Falkland Islands', 'FM': 'Micronesia', 'FO': 'Faroe Islands',
    'FR': 'France', 'GA': 'Gabon', 'GB': 'United Kingdom', 'GD': 'Grenada', 'GE': 'Georgia',
    'GF': 'French Guiana', 'GG': 'Guernsey', 'GH': 'Ghana', 'GI': 'Gibraltar', 'GL': 'Greenland',
    'GM': 'Gambia', 'GN': 'Guinea', 'GP': 'Guadeloupe', 'GQ': 'Equatorial Guinea', 'GR': 'Greece',
    'GT': 'Guatemala', 'GU': 'Guam', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HK': 'Hong Kong',
    'HN': 'Honduras', 'HR': 'Croatia', 'HT': 'Haiti', 'HU': 'Hungary', 'ID': 'Indonesia',
    'IE': 'Ireland', 'IL': 'Israel', 'IM': 'Isle of Man', 'IN': 'India', 'IQ': 'Iraq',
    'IR': 'Iran', 'IS': 'Iceland', 'IT': 'Italy', 'JE': 'Jersey', 'JM': 'Jamaica',
    'JO': 'Jordan', 'JP': 'Japan', 'KE': 'Kenya', 'KG': 'Kyrgyzstan', 'KH': 'Cambodia',
    'KI': 'Kiribati', 'KM': 'Comoros', 'KP': 'North Korea', 'KR': 'South Korea', 'KW': 'Kuwait',
    'KY': 'Cayman Islands', 'KZ': 'Kazakhstan', 'LA': 'Laos', 'LB': 'Lebanon', 'LC': 'Saint Lucia',
    'LI': 'Liechtenstein', 'LK': 'Sri Lanka', 'LR': 'Liberia', 'LS': 'Lesotho', 'LT': 'Lithuania',
    'LU': 'Luxembourg', 'LV': 'Latvia', 'LY': 'Libya', 'MA': 'Morocco', 'MC': 'Monaco',
    'MD': 'Moldova', 'ME': 'Montenegro', 'MF': 'Saint Martin', 'MG': 'Madagascar', 'MH': 'Marshall Islands',
    'MK': 'North Macedonia', 'ML': 'Mali', 'MM': 'Myanmar', 'MN': 'Mongolia', 'MO': 'Macau',
    'MP': 'Northern Mariana Islands', 'MQ': 'Martinique', 'MR': 'Mauritania', 'MS': 'Montserrat',
    'MT': 'Malta', 'MU': 'Mauritius', 'MV': 'Maldives', 'MW': 'Malawi', 'MX': 'Mexico',
    'MY': 'Malaysia', 'MZ': 'Mozambique', 'NA': 'Namibia', 'NC': 'New Caledonia', 'NE': 'Niger',
    'NF': 'Norfolk Island', 'NG': 'Nigeria', 'NI': 'Nicaragua', 'NL': 'Netherlands', 'NO': 'Norway',
    'NP': 'Nepal', 'NR': 'Nauru', 'NU': 'Niue', 'NZ': 'New Zealand', 'OM': 'Oman',
    'PA': 'Panama', 'PE': 'Peru', 'PF': 'French Polynesia', 'PG': 'Papua New Guinea', 'PH': 'Philippines',
    'PK': 'Pakistan', 'PL': 'Poland', 'PM': 'Saint Pierre and Miquelon', 'PR': 'Puerto Rico',
    'PS': 'Palestine', 'PT': 'Portugal', 'PW': 'Palau', 'PY': 'Paraguay', 'QA': 'Qatar',
    'RE': 'Reunion', 'RO': 'Romania', 'RS': 'Serbia', 'RU': 'Russia', 'RW': 'Rwanda',
    'SA': 'Saudi Arabia', 'SB': 'Solomon Islands', 'SC': 'Seychelles', 'SD': 'Sudan',
    'SE': 'Sweden', 'SG': 'Singapore', 'SI': 'Slovenia', 'SK': 'Slovakia', 'SL': 'Sierra Leone',
    'SM': 'San Marino', 'SN': 'Senegal', 'SO': 'Somalia', 'SR': 'Suriname', 'SS': 'South Sudan',
    'ST': 'Sao Tome and Principe', 'SV': 'El Salvador', 'SX': 'Sint Maarten', 'SY': 'Syria',
    'SZ': 'Eswatini', 'TC': 'Turks and Caicos Islands', 'TD': 'Chad', 'TG': 'Togo', 'TH': 'Thailand',
    'TJ': 'Tajikistan', 'TL': 'Timor-Leste', 'TM': 'Turkmenistan', 'TN': 'Tunisia', 'TO': 'Tonga',
    'TR': 'Turkey', 'TT': 'Trinidad and Tobago', 'TV': 'Tuvalu', 'TW': 'Taiwan', 'TZ': 'Tanzania',
    'UA': 'Ukraine', 'UG': 'Uganda', 'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan',
    'VA': 'Vatican City', 'VC': 'Saint Vincent and the Grenadines', 'VE': 'Venezuela', 'VG': 'British Virgin Islands',
    'VI': 'U.S. Virgin Islands', 'VN': 'Vietnam', 'VU': 'Vanuatu', 'WF': 'Wallis and Futuna',
    'WS': 'Samoa', 'YE': 'Yemen', 'YT': 'Mayotte', 'ZA': 'South Africa', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

// Load SVG content
async function loadSVG() {
    try {
        const response = await fetch('world.svg');
        const svgText = await response.text();
        
        // Extract the path elements from the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = svgDoc.querySelectorAll('path');
        
        // Store original viewBox for crisp zooming
        originalViewBox = worldMap.getAttribute('viewBox') || '0 0 1009.6727 665.96301';
        
        // Add paths to our SVG
        paths.forEach(path => {
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            newPath.setAttribute('d', path.getAttribute('d'));
            newPath.setAttribute('title', path.getAttribute('title'));
            newPath.setAttribute('id', path.getAttribute('id'));
            newPath.classList.add('country');
            newPath.setAttribute('fill', '#fffbe6'); // Set default country color to beige
            worldMap.appendChild(newPath);
        });
        
        // Initialize countries array
        countries = Object.keys(countryNames);
        
        // Add event listeners to countries
        addCountryEventListeners();
        
        // Call resetAllCountryColors after loading SVG and after each round
        resetAllCountryColors();
        
    } catch (error) {
        console.error('Error loading SVG:', error);
        // Fallback: create a simple world map representation
        createFallbackMap();
    }
}

// Create fallback map if SVG loading fails
function createFallbackMap() {
    const fallbackCountries = [
        { id: 'US', title: 'United States', d: 'M 100,200 L 300,200 L 300,300 L 100,300 Z' },
        { id: 'CA', title: 'Canada', d: 'M 100,100 L 300,100 L 300,200 L 100,200 Z' },
        { id: 'MX', title: 'Mexico', d: 'M 100,300 L 300,300 L 300,400 L 100,400 Z' },
        { id: 'BR', title: 'Brazil', d: 'M 200,400 L 400,400 L 400,600 L 200,600 Z' },
        { id: 'AR', title: 'Argentina', d: 'M 200,600 L 400,600 L 400,700 L 200,700 Z' },
        { id: 'GB', title: 'United Kingdom', d: 'M 500,200 L 520,200 L 520,220 L 500,220 Z' },
        { id: 'FR', title: 'France', d: 'M 500,220 L 530,220 L 530,250 L 500,250 Z' },
        { id: 'DE', title: 'Germany', d: 'M 510,230 L 530,230 L 530,250 L 510,250 Z' },
        { id: 'IT', title: 'Italy', d: 'M 520,240 L 540,240 L 540,270 L 520,270 Z' },
        { id: 'ES', title: 'Spain', d: 'M 490,240 L 510,240 L 510,260 L 490,260 Z' },
        { id: 'RU', title: 'Russia', d: 'M 600,100 L 800,100 L 800,300 L 600,300 Z' },
        { id: 'CN', title: 'China', d: 'M 700,250 L 850,250 L 850,350 L 700,350 Z' },
        { id: 'IN', title: 'India', d: 'M 650,300 L 750,300 L 750,400 L 650,400 Z' },
        { id: 'JP', title: 'Japan', d: 'M 850,200 L 870,200 L 870,220 L 850,220 Z' },
        { id: 'AU', title: 'Australia', d: 'M 750,450 L 900,450 L 900,600 L 750,600 Z' }
    ];
    
    fallbackCountries.forEach(country => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', country.d);
        path.setAttribute('title', country.title);
        path.setAttribute('id', country.id);
        path.classList.add('country');
        worldMap.appendChild(path);
    });
    
    countries = fallbackCountries.map(c => c.id);
    addCountryEventListeners();
    resetAllCountryColors(); // Ensure fallback map is reset
}

// Add event listeners to country paths
function addCountryEventListeners() {
    const countryPaths = document.querySelectorAll('.country');
    countryPaths.forEach(path => {
        path.addEventListener('click', handleCountryClick);
        // Remove hover event listeners
        path.removeEventListener('mouseenter', handleCountryHover);
        path.removeEventListener('mouseleave', handleCountryLeave);
    });
}

// Handle country click
function handleCountryClick(event) {
    if (!gameActive) return;
    
    const countryId = event.target.id;
    const countryName = countryNames[countryId];
    
    if (!countryName) return;
    
    // Reset all strokes before applying new ones
    document.querySelectorAll('.country').forEach(path => {
        path.style.stroke = '';
        path.style.strokeWidth = '';
    });

    if (countryName === currentCountry) {
        // Correct guess
        score += 10;
        scoreElement.textContent = score;
        feedback.textContent = `Correct! ${countryName} is the right answer!`;
        feedback.className = 'feedback correct';
        
        // Highlight the correct country
        event.target.style.fill = '#43a047'; // Green
        event.target.style.stroke = '#01579b'; // Deep blue outline
        event.target.style.strokeWidth = '3';
        
        // End round
        endRound();
    } else {
        // Wrong guess
        guessesLeft--;
        guessesElement.textContent = guessesLeft;
        
        feedback.textContent = `Wrong! That's ${countryName}. Try again!`;
        feedback.className = 'feedback incorrect';
        
        // Highlight the wrong country temporarily
        event.target.style.fill = '#e53935'; // Red
        event.target.style.stroke = '#c51162'; // Deep magenta outline
        event.target.style.strokeWidth = '3';
        setTimeout(() => {
            event.target.style.fill = '#fffbe6'; // Reset to beige
            event.target.style.stroke = '';
            event.target.style.strokeWidth = '';
        }, 1000);
        
        if (guessesLeft <= 0) {
            feedback.textContent = `Game Over! The correct answer was ${currentCountry}.`;
            feedback.className = 'feedback game-over';
            
            // Highlight the correct country
            const correctPath = document.getElementById(Object.keys(countryNames).find(key => countryNames[key] === currentCountry));
            if (correctPath) {
                correctPath.style.fill = '#43a047';
                correctPath.style.stroke = '#01579b';
                correctPath.style.strokeWidth = '3';
            }
            
            endRound();
        }
    }
}

// Remove handleCountryHover and handleCountryLeave functions

// Start game
function startGame() {
    gameActive = true;
    score = 0;
    guessesLeft = 3;
    currentGuess = 1;
    
    scoreElement.textContent = score;
    guessesElement.textContent = guessesLeft;
    
    startBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    
    // Clear any previous highlighting
    resetAllCountryColors();
    
    nextCountry();
}

// Next country
function nextCountry() {
    if (countries.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * countries.length);
    const countryId = countries[randomIndex];
    currentCountry = countryNames[countryId];
    
    prompt.textContent = `Find: ${currentCountry}`;
    guessesLeft = 3;
    guessesElement.textContent = guessesLeft;
    
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // Clear any previous highlighting
    resetAllCountryColors();
}

// End round
function endRound() {
    gameActive = false;
    nextBtn.textContent = 'Next Country';
}

// Map controls
function zoomIn() {
    const newScale = Math.min(scale * 1.5, 40); // Further increased max zoom in
    if (newScale !== scale) {
        zoomToScale(newScale);
    }
}

function zoomOut() {
    const newScale = Math.max(scale / 1.8, 0.3);
    if (newScale !== scale) {
        zoomToScale(newScale);
    }
}

function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateMapTransform();
    
    // Reset viewBox to original
    if (originalViewBox) {
        worldMap.setAttribute('viewBox', originalViewBox);
    }
}

function zoomToScale(newScale, mouseX = null, mouseY = null) {
    const oldScale = scale;
    
    if (mouseX !== null && mouseY !== null) {
        // Get the mouse position relative to the map wrapper
        const rect = mapWrapper.getBoundingClientRect();
        const mouseXRelative = mouseX - rect.left;
        const mouseYRelative = mouseY - rect.top;
        
        // Calculate the mouse position in the untransformed coordinate system
        const mouseXUntransformed = (mouseXRelative - translateX) / oldScale;
        const mouseYUntransformed = (mouseYRelative - translateY) / oldScale;
        
        // Calculate new translation to keep the mouse point fixed
        scale = newScale;
        translateX = mouseXRelative - mouseXUntransformed * scale;
        translateY = mouseYRelative - mouseYUntransformed * scale;
    } else {
        scale = newScale;
    }
    
    updateMapTransform();
}

function updateViewBox() {
    if (!originalViewBox) return;
    
    const [x, y, width, height] = originalViewBox.split(' ').map(Number);
    const newWidth = width / scale;
    const newHeight = height / scale;
    const newX = x - (translateX / scale);
    const newY = y - (translateY / scale);
    
    worldMap.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
}

function updateMapTransform() {
    // Use viewBox for crisp zooming instead of CSS transforms
    updateViewBox();
    
    // Keep minimal CSS transform for smooth transitions
    if (!isDragging) {
        worldMap.style.transition = 'transform 0.1s ease-out';
    } else {
        worldMap.style.transition = 'none';
    }
    
    // Use minimal transform for fine adjustments
    const fineTranslateX = translateX % 1;
    const fineTranslateY = translateY % 1;
    worldMap.style.transform = `translate(${fineTranslateX}px, ${fineTranslateY}px)`;
    
    // Remove transition after animation completes
    if (!isDragging) {
        setTimeout(() => {
            worldMap.style.transition = '';
        }, 100);
    }
}

// Mouse controls for panning
function handleMouseDown(event) {
    if (event.target.classList.contains('country')) return;
    
    isDragging = true;
    dragStartX = event.clientX - translateX;
    dragStartY = event.clientY - translateY;
    mapWrapper.style.cursor = 'grabbing';
    
    // Disable transitions during dragging for better performance
    worldMap.style.transition = 'none';
}

function handleMouseMove(event) {
    if (!isDragging) return;
    
    translateX = event.clientX - dragStartX;
    translateY = event.clientY - dragStartY;
    updateMapTransform();
}

function handleMouseUp() {
    isDragging = false;
    mapWrapper.style.cursor = 'grab';
    
    // Re-enable transitions after dragging
    worldMap.style.transition = 'transform 0.1s ease-out';
}

// Wheel zoom
function handleWheel(event) {
    event.preventDefault();
    
    if (isZooming) return; // Prevent rapid zooming
    
    isZooming = true;
    
    // Use a larger delta for even faster zooming out
    const delta = event.deltaY > 0 ? 0.80 : 1.15;
    const newScale = Math.max(0.3, Math.min(40, scale * delta)); // Further increased max zoom in
    
    // Always zoom towards mouse position
    zoomToScale(newScale, event.clientX, event.clientY);
    
    // Debounce zoom to prevent lag
    setTimeout(() => {
        isZooming = false;
    }, 20);
}

// Event listeners
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', () => {
    if (gameActive) {
        endRound();
    } else {
        gameActive = true;
        nextCountry();
    }
});

zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
resetViewBtn.addEventListener('click', resetView);

// Map interaction events
mapWrapper.addEventListener('mousedown', handleMouseDown);
mapWrapper.addEventListener('mousemove', handleMouseMove);
mapWrapper.addEventListener('mouseup', handleMouseUp);
mapWrapper.addEventListener('mouseleave', handleMouseUp);
mapWrapper.addEventListener('wheel', handleWheel);

// Prevent context menu on map
mapWrapper.addEventListener('contextmenu', (e) => e.preventDefault());

// Initialize
loadSVG(); 