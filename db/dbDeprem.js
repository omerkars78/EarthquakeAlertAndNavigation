import {openDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

class DbDeprem {
  constructor() {
    this.Db = openDatabase({
      name: 'deprem.db',
      location: 'default',
    });
    this.createCheckTable();
    this.addCheckValue(); // Uygulama ilk çalıştığında checkValue değerini 0 olarak oluşturur
    this.checking();
    this.createImagesTable();
    this.createTimeRangesTable();

  }

  async checking() {
    let DefaultData = await this.getDefaultCheckValue();
    if (DefaultData == 0) {
      this.updateCheckValue(); this.Db.transaction(tx => {
        tx.executeSql('PRAGMA foreign_keys = ON;', [], (tx, results) => {
          console.log('Foreign key constraints enabled');
        });})
     
    }
  }

  
  // En başta 0 olarak oluşturulan default değeri işlem sonunda 1 yapmamızı sağlayacak metod
  updateCheckValue() {
    const query = `UPDATE checkTable SET checkValue = 1`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Check value updated successfully');
      });
    });
  }
  // CheckValue değerini kontrol etmemizi sağlayacak metod
  async getDefaultCheckValue() {
    const query = 'SELECT checkValue FROM checkTable;';
    return new Promise((resolve, reject) => {
      this.Db.transaction(function (txn) {
        txn.executeSql(query, [], function (tx, res) {
          if (res.rows.length > 0) {
            const checkValue = res.rows.item(0).checkValue;
            resolve(checkValue);
            console.log(checkValue);
          } else {
            console.log('No data to display 1 ');
          }
        });
      });
    });
  }
  // Uygulama İlk Çalıştığında Default Verileri Eklemeden Önce Kontrol Yapmamızı Sağlayacak Tablo
  createCheckTable() {
    const query = `CREATE TABLE IF NOT EXISTS checkTable(
        checkValue INTEGER DEFAULT 0
    )`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Check table created successfully');
      });
    });
  }
  // ChechkValue değerine 0 değerini eklememizi sağlayacak metod
  addCheckValue() {
    const query = `INSERT INTO checkTable (checkValue) VALUES (0)`; // 0 değerini default olarak eklemek için DEFAULT kullanıldı
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Check value added successfully');
      });
    });
  }

 
  //****************************  DEPREM VE UYARI İŞLEMLERİ İÇİN **************************************************//

  // Fotoğrafları Saklamak İçin Oluşturulan ve Zaman Aralığı Tablosuyla İlişkili Tablo
  createImagesTable() {
    const query = `CREATE TABLE IF NOT EXISTS images(
            id INTEGER PRIMARY KEY NOT NULL,
            imageURI TEXT NOT NULL
        );`;

    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Images table created successfully');
      });
    });
  }

  // Zaman Aralıklarını Saklayan ve Fotoğrafları Tutan images Tablosuyla İlişkili Tablo
  createTimeRangesTable() {
    const query = `CREATE TABLE IF NOT EXISTS time_ranges(
            id INTEGER PRIMARY KEY NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            image_id INTEGER,
            FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
        );`;

    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Time ranges table created successfully');
      });
    });
  }
  // Images tablosundaki tüm verileri getirir
async getAllImages() {
  return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
          const query = 'SELECT * FROM images';
          tx.executeSql(
              query,
              [],
              (tx, results) => {
                  let data = [];
                  for (let i = 0; i < results.rows.length; i++) {
                      let row = results.rows.item(i);
                      data.push({
                          id: row.id,
                          imageURI: row.imageURI,
                      });
                  }
                  console.log('All Images: ', data);
                  resolve(data);
              },
              (tx, error) => {
                  console.log('Error fetching all images:', error);
                  console.log('Transaction details:', tx);
                  reject(error);
              },
          );
      });
  });
}

// Time_ranges tablosundaki tüm verileri getirir
async getAllTimeRanges() {
  return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
          const query = 'SELECT * FROM time_ranges';
          tx.executeSql(
              query,
              [],
              (tx, results) => {
                  let data = [];
                  for (let i = 0; i < results.rows.length; i++) {
                      let row = results.rows.item(i);
                      data.push({
                          id: row.id,
                          startTime: row.start_time,
                          endTime: row.end_time,
                          imageId: row.image_id,
                      });
                  }
                  console.log('All Time Ranges: ', data);
                  resolve(data);
              },
              (tx, error) => {
                  console.log('Error fetching all time ranges:', error);
                  console.log('Transaction details:', tx);
                  reject(error);
              },
          );
      });
  });
}
  // Sadece Zaman Aralığı Ekleyen Metod
  addTimeRanges() {
    const query = `INSERT INTO time_ranges (start_time,end_time) VALUES (?,?);`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [start_time, end_time], function (tx, res) {
        console.log(`Time ranges added successfully, ID: ${res.insertId}`);
      });
    });
  }
  // Sadece Fotoğraf Yüklenirken Kullanılacak Olan Metod
  addImage(imageURI) {
    const query = `INSERT INTO images (imageURI) VALUES (?);`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [imageURI], function (tx, res) {
        console.log(`Image added successfully, ID: ${res.insertId}`);
      });
    });
  }

  // Önce Zaman Aralığı Ekleyen ve Sonra Onunla İlişkili Fotoğrafı Ekleyen Metod
  addTimeRangeWithImage(startTime, endTime, imageURI) {
    const insertImageQuery = `INSERT INTO images (imageURI) VALUES (?);`;
    const insertTimeRangeQuery = `INSERT INTO time_ranges (start_time, end_time, image_id) VALUES (?, ?, ?);`;

    this.Db.transaction(function (txn) {
      txn.executeSql(insertImageQuery, [imageURI], function (tx, res) {
        console.log('Image added successfully');
        const imageId = res.insertId;
        txn.executeSql(
          insertTimeRangeQuery,
          [startTime, endTime, imageId],
          function (tx, res) {
            console.log('Time range with image added successfully');
          },
        );
      });
    });
  }


  // En Son Eklenen Zaman Aralığı Ve Resmi Almak İçin Bir Metod
  async getLastTimeRangeWithImage() {
    return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
        const query = `
          SELECT time_ranges.start_time, images.imageURI
          FROM time_ranges
          INNER JOIN images ON time_ranges.image_id = images.id
          ORDER BY time_ranges.id DESC
          LIMIT 1;
        `;
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              const {start_time, imageURI} = results.rows.item(0);
              resolve({startTime: start_time, imageURI: imageURI});
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            console.log('Error fetching last time range with image:', error);
            reject(error);
          },
        );
      });
    });
  }

  async getAllTimeRangesWithImages() {
    return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
        const query = `
          SELECT time_ranges.start_time, time_ranges.end_time, images.imageURI
          FROM time_ranges
          INNER JOIN images ON time_ranges.image_id = images.id
          ORDER BY time_ranges.id DESC;
        `;
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            let data = [];
            for (let i = 0; i < results.rows.length; i++) {
              let row = results.rows.item(i);
              data.push({
                startTime: new Date(row.start_time),
                endTime: new Date(row.end_time),
                imageURI: row.imageURI,
              });
            }
            console.log("Time Ranges and Images: ", data);
            resolve(data);
          },
          (tx, error) => {
            console.log('Error fetching time ranges with images get:', error);
            console.log('Transaction details:', tx);
            reject(error);
          },
        );
      });
    });
  }

// Db.js
async isInTimeRange(datetime) {
  try {
    const timeRanges = await this.getAllTimeRangesWithImages();

    let result = timeRanges.find(
      range => {
        const startTimeInSeconds = range.startTime.getHours() * 3600 + range.startTime.getMinutes() * 60 + range.startTime.getSeconds();
        const endTimeInSeconds = range.endTime.getHours() * 3600 + range.endTime.getMinutes() * 60 + range.endTime.getSeconds();
  
        if (startTimeInSeconds > endTimeInSeconds) {
          console.error('Invalid time range: startTime is greater than endTime');
          console.error('startTime:', range.startTime);
          console.error('endTime:', range.endTime);
        }
        return datetime >= startTimeInSeconds && datetime <= endTimeInSeconds;
      },
    );

    console.log("isInTimeRange result: ", result);
    return result;
  } catch (error) {
    console.error('Error in isInTimeRange:', error);
  }
}


  
  
  
  // tüm zaman ve resimleri silmek için bir metod
  deleteAllData() {
    const deleteAllTimeRangesQuery = `DELETE FROM time_ranges;`;
    const deleteAllImagesQuery = `DELETE FROM images;`;
  
    this.Db.transaction(tx => {
      tx.executeSql(deleteAllTimeRangesQuery, [], 
        (tx, res) => {
          console.log('All time ranges deleted successfully');
          tx.executeSql(deleteAllImagesQuery, [],
            (tx, res) => {
              console.log('All images deleted successfully');
            },
            (tx, error) => {
              console.log('Error while deleting all images:', error);
            }
          );
        }, 
        (tx, error) => {
          console.log('Error while deleting all time ranges:', error);
        }
      );
    });
  }
  
}

module.exports = DbDeprem;
