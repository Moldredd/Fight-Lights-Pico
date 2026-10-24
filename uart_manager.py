from machine import UART

#Pin to receive data from GP2040-CE (Defaults at 28).
uart_rx = 28;

uart = UART(uart_rx, baudrate=115200, tx=None, rx=1)  # RX on GPIO 28?

def read_status():
    if uart.any() >= 2:
        b0 = uart.read(1)[0]
        b1 = uart.read(1)[0]

        #profile    =  b0        & 0x03
        inputMode  = (b0 >> 2)  & 0x0F
        auth       = (b0 >> 6)  & 0x01
        socd       =  b1        & 0x03

        return profile, inputMode, auth, socd

    return None

