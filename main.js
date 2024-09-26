const wallpaper = document.querySelector(".wallpaper");
const inputWidth = document.querySelector(".input-width");
const inputHeight = document.querySelector(".input-height");
const inputStartColor = document.querySelector(".input-linear-start-color");
const inputEndColor = document.querySelector(".input-linear-end-color");
const inputRadialColor = document.querySelector(".input-radial-color");
const btnToggleRadial = document.querySelector(".btn-remove-radial");
const btnGenerate = document.querySelector(".btn-generate-wallpaper");
const btnRandomize = document.querySelector(".btn-randomize");
const btnSaveGradient = document.querySelector(".btn-save-gradient");
const savedGradientsSelect = document.getElementById("saved-gradients");

let useRadialGradient = true;

/** 
 * @param {HTMLCanvasElement} canvasElement
 * @param {string} linearStartColor
 * @param {string} linearEndColor
 * @param {string} radialColor
 */
function renderWallpaper(canvasElement, linearStartColor, linearEndColor, radialColor) {
	const ctx = canvasElement.getContext("2d");
	const width = canvasElement.width;
	const height = canvasElement.height;
	const linearGradient = buildLinearGradient(ctx, width, height);

	linearGradient.addColorStop(0, linearStartColor);
	linearGradient.addColorStop(1, linearEndColor);

	ctx.fillStyle = linearGradient;
	ctx.fillRect(0, 0, width, height);

	if (useRadialGradient) {
		const radialGradient = buildRadialGradient(ctx, width, height);
		radialGradient.addColorStop(0, radialColor);
		radialGradient.addColorStop(1, "transparent");

		ctx.fillStyle = radialGradient;
		ctx.fillRect(0, 0, width, height);
	}
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function buildLinearGradient(ctx, width, height) {
	return ctx.createLinearGradient(0, 0, width, height);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function buildRadialGradient(ctx, width, height) {
	const x = getRandomNumber(width * 0.75, width);
	const y = getRandomNumber(height * 0.25, height * 0.75);
	const size = width / 2;

	return ctx.createRadialGradient(x, y, 0, x, y, size);
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderWallpaperFromInput() {
	const containerWidth = wallpaper.parentElement.clientWidth - 10; 
	const containerHeight = Math.min(window.innerHeight * 0.6, wallpaper.parentElement.clientHeight - 10); 
	const aspectRatio = inputWidth.value / inputHeight.value;

	let newWidth, newHeight;

	if (containerWidth / aspectRatio <= containerHeight) {
		newWidth = containerWidth;
		newHeight = containerWidth / aspectRatio;
	} else {
		newHeight = containerHeight;
		newWidth = containerHeight * aspectRatio;
	}

	wallpaper.width = inputWidth.value;
	wallpaper.height = inputHeight.value;

	wallpaper.style.width = `${newWidth}px`;
	wallpaper.style.height = `${newHeight}px`;

	renderWallpaper(
		wallpaper,
		inputStartColor.value,
		inputEndColor.value,
		inputRadialColor.value
	);
}

function toggleRadialGradient() {
	useRadialGradient = !useRadialGradient;
	btnToggleRadial.textContent = useRadialGradient ? "Remove Radial" : "Add Radial";
	renderWallpaperFromInput();
}

function downloadWallpaper() {
	const confirmDownload = confirm("Do you want to download the gradient?");
	if (confirmDownload) {
		const link = document.createElement('a');
		link.download = 'gradient_wallpaper.png';
		link.href = wallpaper.toDataURL();
		link.click();
		
		
		alert("Gradient downloaded, sunshine!");
	}
}

function getRandomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function randomizeGradient() {
	inputStartColor.value = getRandomColor();
	inputEndColor.value = getRandomColor();
	inputRadialColor.value = getRandomColor();
	renderWallpaperFromInput();
}

inputWidth.addEventListener('input', renderWallpaperFromInput);
inputHeight.addEventListener('input', renderWallpaperFromInput);
inputStartColor.addEventListener('input', renderWallpaperFromInput);
inputEndColor.addEventListener('input', renderWallpaperFromInput);
inputRadialColor.addEventListener('input', renderWallpaperFromInput);
btnToggleRadial.addEventListener('click', toggleRadialGradient);
btnGenerate.addEventListener('click', downloadWallpaper);
btnRandomize.addEventListener('click', randomizeGradient);
window.addEventListener('resize', renderWallpaperFromInput);

renderWallpaperFromInput();

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

function toggleTheme() {
	if (htmlElement.getAttribute('data-theme') === 'dark') {
		htmlElement.setAttribute('data-theme', 'light');
		sunIcon.style.display = 'block';
		moonIcon.style.display = 'none';
	} else {
		htmlElement.setAttribute('data-theme', 'dark');
		sunIcon.style.display = 'none';
		moonIcon.style.display = 'block';
	}
}

if (htmlElement.getAttribute('data-theme') === 'light') {
	sunIcon.style.display = 'block';
	moonIcon.style.display = 'none';
} else {
	sunIcon.style.display = 'none';
	moonIcon.style.display = 'block';
}

themeToggle.addEventListener('click', toggleTheme);

const shareButton = document.getElementById('share-button');

shareButton.addEventListener('click', async () => {
	try {
		
		const dataUrl = wallpaper.toDataURL('image/png');

		
		if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([dataUrl], 'gradient_wallpaper.png', { type: 'image/png' })] })) {
			const file = await (await fetch(dataUrl)).blob();
			await navigator.share({
				title: 'My Gradient Wallpaper',
				text: 'Check out this gradient wallpaper I created!',
				files: [new File([file], 'gradient_wallpaper.png', { type: 'image/png' })]
			});
		} else {
			
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'gradient_wallpaper.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			alert('Gradient wallpaper downloaded!');
		}
	} catch (error) {
		console.error('Error sharing/downloading:', error);
		
		if (error.name === 'AbortError') {
			
		} else {
			alert('There was an error sharing or downloading the wallpaper. You can try right-clicking on the image and selecting "Save image as..." instead.');
		}
	}
});

function saveGradient() {
	console.log('saveGradient function called');
	const name = prompt("Enter a name for this gradient:");
	if (name) {
		console.log('Gradient name:', name);
		const gradient = {
			width: inputWidth.value,
			height: inputHeight.value,
			startColor: inputStartColor.value,
			endColor: inputEndColor.value,
			radialColor: inputRadialColor.value,
			useRadial: useRadialGradient
		};
		
		let savedGradients = JSON.parse(localStorage.getItem("savedGradients")) || {};
		savedGradients[name] = gradient;
		localStorage.setItem("savedGradients", JSON.stringify(savedGradients));
		
		updateSavedGradientsList();
		alert(`Gradient "${name}" saved successfully!`);
		console.log('Gradient saved:', name);
	} else {
		console.log('Save cancelled');
	}
}

const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', () => {
	console.log('Save button clicked');
	saveGradient();
});

function updateSavedGradientsList() {
	const savedGradients = JSON.parse(localStorage.getItem("savedGradients")) || {};
	savedGradientsSelect.innerHTML = '<option value="">-- Select a saved gradient --</option>';
	
	for (const [name, gradient] of Object.entries(savedGradients)) {
		const option = document.createElement("option");
		option.value = name;
		option.textContent = name;
		savedGradientsSelect.appendChild(option);
	}
}


updateSavedGradientsList();


function loadSavedGradient(name) {
	const savedGradients = JSON.parse(localStorage.getItem("savedGradients")) || {};
	const gradient = savedGradients[name];
	
	if (gradient) {
		inputWidth.value = gradient.width;
		inputHeight.value = gradient.height;
		inputStartColor.value = gradient.startColor;
		inputEndColor.value = gradient.endColor;
		inputRadialColor.value = gradient.radialColor;
		useRadialGradient = gradient.useRadial;
		
		btnToggleRadial.textContent = useRadialGradient ? "Remove Radial" : "Add Radial";
		
		renderWallpaperFromInput();
	}
}


savedGradientsSelect.addEventListener('change', (event) => {
	const selectedGradientName = event.target.value;
	if (selectedGradientName) {
		loadSavedGradient(selectedGradientName);
	}
});
