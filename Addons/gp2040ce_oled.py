import uart_receiver

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

#Used for GP2040CE Input information for the Fight-Lights' oled screen.
enable_gp2040ce_info = False

#Used for information gathering logic.
current_profile = ""
current_input_mode = 0
current_auth_status = 0
current_socd_mode = 0

new_profile = ""
new_input_mode = 0
new_auth_status = 0
new_socd_mode = 0

#To enable/show GP2040-CE profile information on screen.
show_profile = False

#Horizontal positioning for the GP2040-CE profile information text on screen.
profile_position_x = 0

#Vertical positioning for the GP2040-CE profile information text on screen.
profile_position_y = 0;

#GP2040-CE profile text size.
profile_size = 8

#Used to store the GP2040-CE profile text to be displayed on screen.
profile = ""

#To enable/show input information on screen.
show_input = False

#Horizontal positioning for the input information text on screen.
input_position_x = 0

#Vertical positioning for the input information text on screen.
input_position_y = 0

#Input text size.
input_size = 8

#Used to store the input mode text to be displayed on screen.
input_mode = ""

#To enable/show PS4/PS5/XONE input authorization on screen.
show_auth_status = False

#Horizontal positioning for the authorization information text on screen.
auth_position_x = 0

#Vertical positioning for the authorization information text on screen.
auth_position_y = 0

#Flag for authentication status
auth_status = 0

#Auth text size.
auth_size = 8;

#Used to store the input authentication text to be displayed on screen.
input_auth = ""

#To enable/show socd information on screen.
show_socd_info = False

#Horizontal positioning for the socd information text on screen.
socd_position_x = 0

#Vertical positioning for the socd information text on screen.
socd_position_y = 0

#Socd text size.
socd_size = 8

#Used to store the socd mode text to be displayed on screen.
socd_mode = ""
