from flask import Flask, jsonify, request
import mysql.connector
import time
from flask_socketio import SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Add SocketIO support

cnx = mysql.connector.connect(
    host="localhost",
    user="root",
    password="oMerkars78a",
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

    socketio.emit("new_signal", {"id": cursor.lastrowid, "tarih_saat": tarih_saat, "signals": signal})

    return jsonify({"status": "success"})




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

