import RPi.GPIO as GPIO
import time
import requests

#GPIO SETUP
channel = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.IN)

api_url = "http://192.168.1.53:5000/api/titresim_verileri"  # Replace with your API endpoint

def send_to_api(signal):
    data = {"signals": signal}
    response = requests.post(api_url, json=data)

    if response.status_code == 200:
        print("Data sent successfully")
    else:
        print("Error sending data")

def callback(channel):
    if GPIO.input(channel):
        print("Movement Detected! Signal: HIGH")
        send_to_api("HIGH")
    else:
        print("Movement Detected! Signal: LOW")
        send_to_api("LOW")

GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=300)  # let us know when the pin goes HIGH or LOW
GPIO.add_event_callback(channel, callback)  # assign function to GPIO PIN, Run function on change

# infinite loop
while True:
    time.sleep(1)
