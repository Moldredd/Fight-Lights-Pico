let enable_uart = false;
let uart_tx_pin = null;
let uart_rx_pin = null;

function toggleUARTCheckBox() {
    const container = document.getElementById('mbdyUART');
    const checkbox = document.getElementById('chkUART');
    const checkboxGP2040CEInfo = document.getElementById('chkGP2040CEInfo');
    const link = document.getElementById('uart_link');
    const ddlTX = document.getElementById('uart_tx_pin_num');
    const ddlRX = document.getElementById('uart_rx_pin_num');

    if (!checkbox.checked) {
        container.classList.add('disabled-container');
        container.querySelectorAll('input, select, button, textarea')
            .forEach(el => el.disabled = true);
        link.classList.add('nav-disabled');
        ddlTX.value = '';
        ddlRX.value = '';
        checkboxGP2040CEInfo.checked = false;
        resetGP2040CEInfoDisplay();
        toggleGP2040CEInfoCheckBox();
    } else {
        container.classList.remove('disabled-container');
        container.querySelectorAll('input, select, button, textarea')
            .forEach(el => el.disabled = false);
        link.classList.remove('nav-disabled');
    }

    enable_uart = checkbox.checked; 
    enableGP2040CEInfoCheckBox(); // Call the function to enable/disable the GP2040CE Info checkbox based on UART state
}

function enableGP2040CEInfoCheckBox() {
    const checkbox = document.getElementById("chkGP2040CEInfo");
    checkbox.disabled = !enable_uart; // Disable the checkbox if UART is not enabled);
}

function initUARTComponents(enableUart = false, txPin = null, rxPin = null) {
    enable_uart = enableUart;
    uart_tx_pin = txPin;
    uart_rx_pin = rxPin;
}

// Export it for external use
window.initUARTComponents = initUARTComponents;

