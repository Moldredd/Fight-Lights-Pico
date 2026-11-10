class GP2040CEInfoDisplay {
    constructor(ctx, x, y, preview, pixelatedPreview = false, font = "8px Arial", color = "#FFFFFF") {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.x = x;
        this.y = y;
        this.preview = preview;
        this.isPixelated = pixelatedPreview;
        this.font = font;
        this.color = color;

        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    setPixel(x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }

    drawText() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = "top";

        // Draw text normally (canvas handles rasterization)
        this.ctx.fillText(this.preview, this.x, this.y);
    }

    // Optional: pixel-perfect text (OLED-style)
    drawPixelatedText() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = "top";

        // Draw text to an offscreen canvas
        const off = document.createElement("canvas");
        off.width = 200;
        off.height = 50;
        const offCtx = off.getContext("2d");

        offCtx.font = this.font;
        offCtx.fillStyle = this.color;
        offCtx.textBaseline = "top";
        offCtx.fillText(this.preview, 0, 0);

        // Read pixels and draw them 1x1 on your OLED canvas
        const imgData = offCtx.getImageData(0, 0, off.width, off.height);
        const data = imgData.data;

        for (let py = 0; py < imgData.height; py++) {
            for (let px = 0; px < imgData.width; px++) {
                const idx = (py * imgData.width + px) * 4;
                const alpha = data[idx + 3];
                if (alpha > 128) {
                    this.setPixel(this.x + px, this.y + py);
                }
            }
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Simple bounding box hit test
        this.ctx.font = this.font;
        const width = this.ctx.measureText(this.preview).width;
        const metrics = this.ctx.measureText(this.preview);
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        if (
            mouseX >= this.x &&
            mouseX <= this.x + width &&
            mouseY >= this.y &&
            mouseY <= this.y + height
        ) {
            this.isDragging = true;
            this.offsetX = mouseX - this.x;
            this.offsetY = mouseY - this.y;
            selectedGP2040CEInfoOption = this; // keep your existing selection logic
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let newX = mouseX - this.offsetX;
            let newY = mouseY - this.offsetY;

            // OLED bounds
            newX = Math.max(0, Math.min(this.canvas.width, newX));
            newY = Math.max(0, Math.min(this.canvas.height, newY));

            this.x = Math.round(newX);
            this.y = Math.round(newY);

            updateGP2040CEInfoCanvas();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    moveBy(dx, dy) {
        this.x = Math.max(0, Math.min(this.canvas.width, this.x + dx));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y + dy));

        gp2040ceinfo_display_x = this.x;
        gp2040ceinfo_display_y = this.y;
        updateGP2040CEInfoCanvas();
    }
}

let isGP2040CEInfoCanvasDrawn = false;
let selectedGP2040CEInfoOption = null;
let gp2040ceInfoOptions = [];

let enable_gp2040ceinfo = false; // For config.py
let gp2040ceinfo_display_mode = 0; // For config.py
let gp2040ceinfo_compact_display = false; // for config.py
let gp2040ceinfo_display_x = 5; // For config.py
let gp2040ceinfo_display_y = 5; // For config.py

// Used for web configuration preview
let gp2040ceInfoDisplayPreview = '';
let gp2040ceInfoInputPreview = 'XINPUT';
let gp2040ceInfoAuthPreview = 'Auth:OK';
let gp2040ceInfoSOCDPreview = 'SOCD-U';

function toggleGP2040CEInfoCheckBox() {
    const container = document.getElementById('mdlBdyGP2040CEInfo');
    const checkbox = document.getElementById("chkGP2040CEInfo");
    const link = document.getElementById("gp2040ce_info_link");

    if (!checkbox.checked) {
        container.classList.add('disabled-container');
        container.querySelectorAll('input, select, button, textarea')
            .forEach(el => el.disabled = true);
        link.classList.add('nav-disabled');
        resetGP2040CEInfoDisplay();
    } else {
        container.classList.remove('disabled-container');
        container.querySelectorAll('input, select, button, textarea')
            .forEach(el => el.disabled = false);
        link.classList.remove('nav-disabled');
    }

    enable_gp2040ceinfo = checkbox.checked;
}

function toggleInputDisplayCompactDisplay() {
    const btn = document.getElementById('btnGP2040CEInfoDisplayModeToggle');

    if (btn.innerText === 'Normal Display') {
        gp2040ceinfo_compact_display = true;
        btn.innerText = 'Compact Display';
        btn.classList.remove('normal-display');
        btn.classList.add('compact-display');
    } else {
        gp2040ceinfo_compact_display = false;
        btn.innerText = 'Normal Display';
        btn.classList.remove('compact-display');
        btn.classList.add('normal-display');
    }
}

function toggleInputDisplayColor() {
    if (gp2040ceInfoOptions.length > 0) {
        if (gp2040ceInfoOptions[0].color === '#FF0000') {
            gp2040ceInfoOptions[0].color = '#FFFFFF';
        } else {
            gp2040ceInfoOptions[0].color = '#FF0000';
        }
    }
}

function  resetGP2040CEInfoDisplay() {
    const dropdownInputMode = document.getElementById('ddlGP2040CEInfoInputPreview');
    const dropdownAuthStatus = document.getElementById('ddlGP2040CEInfoAuthPreview');
    const dropdownSOCDMode = document.getElementById('ddlGP2040CEInfoSOCDPreview');
    const btnCompactDisplay = document.getElementById('btnGP2040CEInfoDisplayModeToggle');
    const dropdownDisplayMode = document.getElementById('ddlGP2040CEInfoDisplayMode');

    gp2040ceinfo_compact_display = false;
    btnCompactDisplay.innerText = 'Normal Display';
    btnCompactDisplay.classList.remove('compact-display');
    btnCompactDisplay.classList.add('normal-display');

    dropdownInputMode.value = '';
    dropdownAuthStatus.value = '';
    dropdownSOCDMode.value = '';
    dropdownDisplayMode.value = '0';

    gp2040ceInfoInputPreview = dropdownInputMode.value;
    gp2040ceInfoAuthPreview = dropdownAuthStatus.value;
    gp2040ceInfoSOCDPreview = dropdownSOCDMode.value;

    gp2040ceinfo_display_mode = dropdownDisplayMode.value; // Value to save in Config.
    gp2040ceinfo_compact_display = false; // Value to save in Config.
    gp2040ceinfo_display_x = 5; // Value to save in Config.
    gp2040ceinfo_display_y = 5; // Value to save in Config.

        if (gp2040ceInfoOptions.length > 0) {
            gp2040ceInfoOptions[0].x = gp2040ceinfo_display_x;
            gp2040ceInfoOptions[0].y = gp2040ceinfo_display_y;
            gp2040ceInfoOptions[0].color = '#FFFFFF';
    }
    
    updateGP2040CEInfoDisplay();
}

function  updateGP2040CEInfoDisplay() {
    const dropdownInputModeValue = document.getElementById('ddlGP2040CEInfoInputPreview').value;
    const dropdownAuthStatusValue = document.getElementById('ddlGP2040CEInfoAuthPreview').value;
    const dropdownSOCDModeValue = document.getElementById('ddlGP2040CEInfoSOCDPreview').value;
    const dropdownDisplayModeValue = document.getElementById('ddlGP2040CEInfoDisplayMode').value;

    if (gp2040ceinfo_compact_display) {
        gp2040ceInfoInputPreview = dropdownInputModeValue.slice(0, 3);
        gp2040ceInfoAuthPreview = dropdownAuthStatusValue.slice(-2);
        gp2040ceInfoSOCDPreview = dropdownSOCDModeValue.slice(-1);
    } else {
        gp2040ceInfoInputPreview = dropdownInputModeValue;
        gp2040ceInfoAuthPreview = dropdownAuthStatusValue;
        gp2040ceInfoSOCDPreview = dropdownSOCDModeValue;
    }

    switch (dropdownDisplayModeValue) {
        case "0": gp2040ceInfoDisplayPreview = ''; break;
        case "1": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '|' + gp2040ceInfoAuthPreview + '|' + gp2040ceInfoSOCDPreview; break; // IIIIII|AA|SSSS-S
        case "2": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '/' + gp2040ceInfoAuthPreview + '/' + gp2040ceInfoSOCDPreview; break; // IIIIII/AA/SSSS-S
        case "3": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '-' + gp2040ceInfoAuthPreview + '-' + gp2040ceInfoSOCDPreview; break; // IIIIII-AA-SSSS-S
        case "4": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + ' ' + gp2040ceInfoAuthPreview + ' ' + gp2040ceInfoSOCDPreview; break; // IIIIII AA SSSS-S

        case "5": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '|' + gp2040ceInfoAuthPreview; break; // IIIIII|AAAA:AA
        case "6": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '/' + gp2040ceInfoAuthPreview; break; // IIIIII|AAAA:AA
        case "7": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '-' + gp2040ceInfoAuthPreview; break; // IIIIII|AAAA:AA
        case "8": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + ' ' + gp2040ceInfoAuthPreview; break; // IIIIII|AAAA:AA

        case "9": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '|' + gp2040ceInfoSOCDPreview; break; // IIIIII/SSSS-S
        case "10": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '/' + gp2040ceInfoSOCDPreview; break; // IIIIII/SSSS-S
        case "11": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + '-' + gp2040ceInfoSOCDPreview; break; // IIIIII/SSSS-S
        case "12": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview + ' ' + gp2040ceInfoSOCDPreview; break; // IIIIII/SSSS-S

        case "13": gp2040ceInfoDisplayPreview = gp2040ceInfoAuthPreview + '|' + gp2040ceInfoSOCDPreview; break; // AAAA:AA|SSSS-S
        case "14": gp2040ceInfoDisplayPreview = gp2040ceInfoAuthPreview + '/' + gp2040ceInfoSOCDPreview; break; // AAAA:AA|SSSS-S
        case "15": gp2040ceInfoDisplayPreview = gp2040ceInfoAuthPreview + '-' + gp2040ceInfoSOCDPreview; break; // AAAA:AA|SSSS-S
        case "16": gp2040ceInfoDisplayPreview = gp2040ceInfoAuthPreview + ' ' + gp2040ceInfoSOCDPreview; break; // AAAA:AA|SSSS-S

        case "17": gp2040ceInfoDisplayPreview = gp2040ceInfoInputPreview; break; // IIIIII
        case "18": gp2040ceInfoDisplayPreview = gp2040ceInfoAuthPreview; break; // AAAA:AA
        case "19": gp2040ceInfoDisplayPreview = gp2040ceInfoSOCDPreview; break; // SSSS-S
    }

    gp2040ceinfo_display_mode = dropdownDisplayModeValue; // Value to save in Config.

    if (gp2040ceInfoOptions.length > 0) {
        gp2040ceInfoOptions[0].preview = gp2040ceInfoDisplayPreview;
    }
    updateGP2040CEInfoCanvas();
}

function addGP2040CEInfoDisplayToCanvas() {
    const canvas = document.getElementById('cvsGP2040CEInfo');
    const ctx = canvas.getContext('2d');

    if (gp2040ceInfoOptions.length === 0) {
        const display = new GP2040CEInfoDisplay(
            ctx,
            gp2040ceinfo_display_x,
            gp2040ceinfo_display_y,
            gp2040ceInfoDisplayPreview
        );

        gp2040ceInfoOptions.push(display);

        canvas.addEventListener('mousedown', e => display.handleMouseDown(e));
        canvas.addEventListener('mousemove', e => display.handleMouseMove(e));
        canvas.addEventListener('mouseup', e => display.handleMouseUp(e));
    }
}

function drawGP2040CEInfoCanvas() {
    const canvas = document.getElementById('cvsGP2040CEInfo');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    isGP2040CEInfoCanvasDrawn = true;
}

function updateGP2040CEInfoCanvas() {
    const canvas = document.getElementById('cvsGP2040CEInfo');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gp2040ceInfoOptions.forEach(item => {
        if (item.isPixelated)
            item.drawPixelatedText();
        else
            item.drawText();
    });
}

document.addEventListener('keydown', function (event) {
    const step = 1;
    if (selectedGP2040CEInfoOption) {
        switch (event.key) {
            case 'ArrowUp':
                selectedGP2040CEInfoOption.moveBy(0, -step);
                event.preventDefault();
                break;
            case 'ArrowDown':
                selectedGP2040CEInfoOption.moveBy(0, step);
                event.preventDefault();
                break;
            case 'ArrowLeft':
                selectedGP2040CEInfoOption.moveBy(-step, 0);
                event.preventDefault();
                break;
            case 'ArrowRight':
                selectedGP2040CEInfoOption.moveBy(step, 0);
                event.preventDefault();
                break;
            case 'p':
                //console.log(gp2040ceinfoOptions);
                event.preventDefault();
                break;
        }
    }
});

function exportGP2040CEInfoCanvasAsPNG() {
    const canvas = document.getElementById('cvsGP2040CEInfo');
    const ctx = canvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');

    tempContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    const dataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'layout.png';
    link.click();
}

function initGP2040CEInfoOledComponents() {
    if (!isGP2040CEInfoCanvasDrawn)
        drawGP2040CEInfoCanvas();

    const uploadBtn = document.getElementById('gp2040ceinfo_oled_upload_animation_button');
    const uploadInput = document.getElementById('gp2040ceinfo_uploadPngs');
    // const radiusInput = document.getElementById('gp2040ceinfo_oled_button_radius');
    // const angleInput = document.getElementById('gp2040ceinfo_oled_key_angle');

    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', function () {
            uploadInput.click();
        });

        uploadInput.addEventListener('change', handlePngUpload);
    }

    addGP2040CEInfoDisplayToCanvas();
    enableGP2040CEInfoCheckBox();
}

// Export it for external use
window.initGP2040CEInfoOledComponents = initGP2040CEInfoOledComponents;

