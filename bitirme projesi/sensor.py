# # import RPi.GPIO as GPIO
# # import time
# # import mysql.connector

# # # MySQL veritabanı bağlantısı
# # mydb = mysql.connector.connect(
# #   host="localhost",
# #   user="kullaniciadi",
# #   password="sifre",
# #   database="veritabani_adi"
# # )

# # # GPIO pin numarasını tanımla
# # sensorPin = 17

# # # GPIO ayarları
# # GPIO.setmode(GPIO.BCM)
# # GPIO.setup(sensorPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# # # Sonsuz döngü
# # while True:
# #     # Sensör pininin durumunu oku
# #     currentState = GPIO.input(sensorPin)

# #     # Sensör titreşim algılarsa
# #     if currentState == GPIO.HIGH:
# #         # Veritabanına kaydetmek için bir SQL sorgusu oluştur
# #         sql = "INSERT INTO titreşimler (zaman) VALUES (%s)"
# #         val = (time.strftime('%Y-%m-%d %H:%M:%S'),)
# #         mycursor = mydb.cursor()
# #         mycursor.execute(sql, val)
# #         mydb.commit()

# #     # Kısa bir bekleme süresi
# #     time.sleep(0.1)

# import mysql.connector
# import RPi.GPIO as GPIO
# import time

# vibration_pin = 17

# GPIO.setmode(GPIO.BCM)
# GPIO.setup(vibration_pin, GPIO.IN)

# # MySQL veritabanına bağlantı
# cnx = mysql.connector.connect(
#     host="192.168.1.53",
#     port=5000,
#     user="root",
#     password="",
#     database="vibration_sensor_api"
# )

# # Veritabanına kayıt fonksiyonu
# def veritabanina_kaydet(tarih_saat):
#     cursor = cnx.cursor()
#     sorgu = "INSERT INTO titresim_verileri (tarih_saat) VALUES (%s)"
#     cursor.execute(sorgu, (tarih_saat,))
#     cnx.commit()

# try:
#     while True:
#         if GPIO.input(vibration_pin):
#             tarih_saat = time.strftime("%Y-%m-%d %H:%M:%S")
#             print(f"Yüksek sinyal algılandı: {tarih_saat}")
#             veritabanina_kaydet(tarih_saat)
#         time.sleep(1)  # İstediğiniz sıklıkta kontrol etmek için bu değeri değiştirin
# except KeyboardInterrupt:
#     GPIO.cleanup()
#     cnx.close()

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
