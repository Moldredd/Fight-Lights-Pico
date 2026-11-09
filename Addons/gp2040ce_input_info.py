from Addons import uart_manager
from config import uart_tx_pin, uart_rx_pin

INPUT_MODE = {
    0: "Unknown",
    1: "XInput",
    2: "XONE",
    3: "PS3",
    4: "PS4",
    5: "PS5",
    6: "Switch",
    7: "Switch Pro",
    8: "Android",
    9: "MisTer FPGA",
    10: "Keyboard"
}

AUTHENTICATION_STATUS = {
    0: "Authenticating",
    1: "OK",
    2: "FAILED",
    3: "N/A"
}

SOCD_MODE = {
    0: "Unknown",
    1: "Neutral",
    2: "Up Priority",
    3: "Last Input",
    4: "Off"
}

current_state = {
    "profile": 0,
    "inputMode": 0,
    "auth": 0,
    "socd": 0
}

def read_gp2040ce_info():
    uart = uart_manager.get_uart(uart_tx_pin, uart_rx_pin)

    if uart.any() >= 2:
        data = uart.read(2)
        if not data or len(data) < 2:
            return None

        b0, b1 = data[0], data[1]

        profile    =  b0        & 0x03
        inputMode  = (b0 >> 2)  & 0x0F
        auth       = (b0 >> 6)  & 0x01
        socd       =  b1        & 0x03

        return profile, inputMode, auth, socd

    return None
