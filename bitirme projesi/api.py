from flask import Flask, jsonify, request
import mysql.connector
import time
app = Flask(__name__)

cnx = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="vib_sensor"
)

@app.route("/api/titresim_verileri", methods=["GET"])
def get_titresim_verileri():
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM titresim_verileri")
    rows = cursor.fetchall()
    cursor.close()

    veriler = []
    for row in rows:
        veriler.append({"id": row[0], "tarih_saat": row[1], "signals": row[2]})
    return jsonify(veriler)

@app.route("/api/titresim_verileri", methods=["POST"])
def post_titresim_verileri():
    signal = request.json["signals"]
    tarih_saat = time.strftime("%Y-%m-%d %H:%M:%S")

    cursor = cnx.cursor()
    sorgu = "INSERT INTO titresim_verileri (tarih_saat, signals) VALUES (%s, %s)"
    cursor.execute(sorgu, (tarih_saat, signal))
    cnx.commit()

    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="192.168.1.53", port=5000)
