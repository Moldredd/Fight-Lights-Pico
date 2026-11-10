let enable_uart = false;
let uart_tx_pin = null;
let uart_rx_pin = null;

function toggleUARTCheckBox() {
    const container = document.getElementById('mbdyUART');
    const checkbox = document.getElementById('chkUART');
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
    } else {
        container.classList.remove('disabled-container');
        container.querySelectorAll('input, select, button, textarea')
            .forEach(el => el.disabled = false);
        link.classList.remove('nav-disabled');
    }
}

function initUARTComponents() {
}

// Export it for external use
window.initUARTComponents = initUARTComponents;

