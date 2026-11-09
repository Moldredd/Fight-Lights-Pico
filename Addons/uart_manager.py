from machine import UART

_uart_instance = None

def get_uart(tx_pin=None, rx_pin=28):
    global _uart_instance
    
    if _uart_instance is None:
        _uart_instance = UART(0, baudrate=115200, tx=tx_pin, rx=rx_pin)
        
    return _uart_instance
