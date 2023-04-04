from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL veritabanına bağlantı
cnx = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="vibration_sensor_api"
)

@app.route("/api/titresim_verileri")
def get_titresim_verileri():
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM titresim_verileri")
    rows = cursor.fetchall()
    cursor.close()

    # Verileri JSON formatında döndürün
    veriler = []
    for row in rows:
        veriler.append({"id": row[0], "tarih_saat": row[1]})
    return jsonify(veriler)

if __name__ == "__main__":
    app.run(host="192.168.1.53", port=5000)

# cnx = mysql.connector.connect(
#     host="192.168.1.53",
#     port=3306,
#     user="rpi_user",
#     password="rpi_password",
#     database="vibration_sensor_api"
# )
# raspbery pi için özel kullanıcı adı ve şifre oluşturuldu ve veritabanına erişim sağlandı.