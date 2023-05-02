import {openDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';


class Db {
  constructor() {
    this.Db = openDatabase({
      name: 'beacon4.db',
      location: 'default',
    });
    this.createCheckTable();
    this.addCheckValue(); // Uygulama ilk çalıştığında checkValue değerini 0 olarak oluşturur
    this.checking();
  }
  
  async checking(){
    let DefaultData = await this.getDefaultCheckValue();
    if(DefaultData == 0){
      this.createMainRoutesTable();
      this.createRoutesTable();
      this.importCsvData('mainRoutes.csv', 'mainRoutes');
      this.importCsvData('routes.csv', 'routes');
      this.updateCheckValue();
    }
  }

  async importCsvData(csvFileName, tableName) {
    const assetPath = Platform.select({
      ios: `${RNFS.MainBundlePath}/${csvFileName}`,
      android: `${RNFS.DocumentDirectoryPath}/${csvFileName}`,
    });

    try {
      await RNFS.copyFileAssets(csvFileName, assetPath);
      const data = await RNFS.readFile(assetPath, 'utf8');
      const records = data.trim().split('\n');
      const headers = records[0].split(',');

      // Remove the header row
      records.shift();

      for (const record of records) {
        const fields = record.split(',');
        const fieldData = {};

        fields.forEach((field, index) => {
          fieldData[headers[index]] = field;
        });

        await this.insertData(tableName, fieldData);
      }
    } catch (error) {
      console.error('Error importing CSV data:', error);
    }
  }

  insertData(tableName, fieldData) {
    const fields = Object.keys(fieldData).join(', ');
    const values = Object.values(fieldData)
      .map(value => `'${value}'`)
      .join(', ');
    const query = `INSERT INTO ${tableName} (${fields}) VALUES (${values});`;

    return new Promise((resolve, reject) => {
      this.Db.transaction(txn => {
        txn.executeSql(
          query,
          [],
          (tx, res) => {
            console.log(
              `Data inserted into ${tableName} successfully, ID: ${res.insertId}`,
            );
            resolve();
          },
          (tx, error) => {
            console.log(
              `Error inserting data into ${tableName}:`,
              error.message,
            );
            reject();
          },
        );
      });
    });
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
      })
    }

  //****************************  BİNA İÇİ YÖNLENDİRME VE ACİL ÇIKIŞ İÇİN **************************************************//

  // acil çıkış ve bina içi yönlendirme için oluşturuduğumuz bir tablo
  createMainRoutesTable() {
    const query = `CREATE TABLE IF NOT EXISTS mainRoutes(
            id INTEGER PRIMARY KEY NOT NULL,
            startMajor CHAR(4) NOT NULL,
            startMinor CHAR(4) NOT NULL,
            finishMajor CHAR(4) NOT NULL,
            finishMinor CHAR(4) NOT NULL
        );`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Main routes table created successfully');
      });
    });
  }

  // acil çıkış ve bina içi yönlendirme için oluşturuduğumuz bir tablo
  createRoutesTable() {
    const query = `CREATE TABLE IF NOT EXISTS routes(
            id INTEGER PRIMARY KEY NOT NULL,
            mainRouteId INTEGER NOT NULL,
            curMajor CHAR(4) NOT NULL,
            curMinor CHAR(4) NOT NULL,
            nextMajor CHAR(4)  NOT NULL,
            nextMinor CHAR(4) NOT  NULL,
            nextDirection CHAR(100) NOT NULL,
            nextDistance DOUBLE NOT NULL,
            beforeMajor CHAR(4) NOT NULL,
            beforeMinor CHAR(4) NOT NULL,
            beforeDirection CHAR(100) NOT NULL,
            beforeDistance DOUBLE NOT NULL,
            nextText CHAR(100) NOT NULL,
            FOREIGN KEY (mainRouteId) REFERENCES mainRoutes(id)
        );`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Routes table created successfully');
      });
    });
  }

  // Main rotları Ekleme Metodu
  addMainRoute(startMajor, startMinor, finishMajor, finishMinor) {
    const query = `INSERT INTO mainRoutes (startMajor, startMinor, finishMajor, finishMinor) VALUES (?,?,?,?);`;
    this.Db.transaction(function (txn) {
      txn.executeSql(
        query,
        [startMajor, startMinor, finishMajor, finishMinor],
        function (tx, res) {
          console.log(`Main route added successfully, ID: ${res.insertId}`);
        },
      );
    });
  }

  // Normal rotaları ekleme metodu
  addRoute(
    mainRouteId,
    curMajor,
    curMinor,
    nextMajor,
    nextMinor,
    nextDirection,
    nextDistance,
    beforeMajor,
    beforeMinor,
    beforeDirection,
    beforeDistance,
    nextText,
  ) {
    const query = `INSERT INTO routes (mainRouteId, curMajor, curMinor, nextMajor, nextMinor, nextDirection, nextDistance, beforeMajor, beforeMinor, beforeDirection, beforeDistance,nextText) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;
    this.Db.transaction(function (txn) {
      txn.executeSql(
        query,
        [
          mainRouteId,
          curMajor,
          curMinor,
          nextMajor,
          nextMinor,
          nextDirection,
          nextDistance,
          beforeMajor,
          beforeMinor,
          beforeDirection,
          beforeDistance,
          nextText,
        ],
        function (tx, res) {
          console.log(`Route added successfully, ID: ${res.insertId}`);
        },
      );
    });
  }

  // Yönlendirme oklarını güncelleme metodu
  updateDirections(
    mainRouteId,
    oldBeforeDirection,
    newBeforeDirection,
    oldNextDirection,
    newNextDirection,
  ) {
    const query = `
        UPDATE routes
        SET beforeDirection = CASE WHEN beforeDirection = ? THEN ? ELSE beforeDirection END,
            nextDirection = CASE WHEN nextDirection = ? THEN ? ELSE nextDirection END
        WHERE mainRouteId = ?;
      `;

    this.Db.transaction(txn => {
      txn.executeSql(
        query,
        [
          oldBeforeDirection,
          newBeforeDirection,
          oldNextDirection,
          newNextDirection,
          mainRouteId,
        ],
        (tx, res) => {
          console.log(`Updated directions for mainRouteId: ${mainRouteId}`);
        },
        (tx, error) => {
          console.log(`Error updating directions: ${error.message}`);
        },
      );
    });
  }

  // Tüm detaylı rota bilgilerni alma metodu
  async getAllRoutes(callback) {
    const query = 'SELECT * FROM routes;';
    return new Promise((resolve, reject) => {
      this.Db.transaction(function (txn) {
        txn.executeSql(query, [], function (tx, res) {
          var data = [];
          for (let i = 0; i < res.rows.length; i++) {
            const element = res.rows.item(i);
            data.push(element);
          }
          if (data.length > 0) {
            resolve(data);
            console.log(data);
          } else {
            console.log('No data to display');
          }
        });
      });
    });
  }

  // Tüm Main Rota Bilgilerini Alma Metodu
  async getAllMainRoutes(callback) {
    const query = `SELECT * FROM mainRoutes;`;
    return new Promise((resolve, reject) => {
      this.Db.transaction(txn => {
        txn.executeSql(query, [], (tx, res) => {
          // console.log(res.rows.length);
          // console.log(res.rows.item(0));
          var mainData = [];
          for (let i = 0; i < res.rows.length; i++) {
            const element = res.rows.item(i); // data olduğu müddetçe döngüye girer.listeye eklenir.
            mainData.push(element);
          }
          resolve(mainData);
          console.log(mainData);
        });
      });
    });
  }

  // Hedef İle Eşleşen Rota Bilgilerini Alma Metodu
  async searchMatchedData(startMajor, startMinor, finishMajor, finishMinor) {
    try {
      return new Promise((resolve, reject) => {
        this.Db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM mainRoutes,routes WHERE mainRoutes.id = routes.mainRouteId AND startMajor = ? AND startMinor = ? AND finishMajor = ? AND finishMinor = ?',
            [startMajor, startMinor, finishMajor, finishMinor],
            (tx, results) => {
              //array destructing
              const [...datas] = results.rows.raw();
              resolve(datas);
            },
            error => {
              reject(error);
            },
          );
        });
      });
    } catch (error) {
      console.log('SQL error Bu errordur:', error);
    }
  }

  // Tüm Main Rotaları Silen Metod
  deleteAllMainRoutes() {
    const query = 'DELETE FROM mainRoutes;';
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('All main routes deleted successfully');
      });
    });
  }

  // Tüm Detaylı Rotaları Silen Metod
  deleteAllRoutes() {
    const query = 'DELETE FROM routes;';
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('All routes deleted successfully');
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
        txn.executeSql(insertTimeRangeQuery, [startTime, endTime, imageId], function (tx, res) {
          console.log('Time range with image added successfully');
        });
      });
    });
  }
  // Zaman Aralığı ve İlişkili Fotoğrafı Silen Metod
  deleteTimeRangeWithImage(startTime, endTime, imageURI) {
    const deleteTimeRangeQuery = `DELETE FROM time_ranges WHERE start_time = ? AND end_time = ?;`;
    const deleteImageQuery = `DELETE FROM images WHERE imageURI = ?;`;
  
    this.Db.transaction(function (txn) {
      txn.executeSql(deleteTimeRangeQuery, [startTime, endTime], function (tx, res) {
        console.log('Time range deleted successfully');
        txn.executeSql(deleteImageQuery, [imageURI], function (tx, res) {
          console.log('Image deleted successfully');
        });
      });
    });
  }
  
  
  // Fotoğraf Silmek İçin Gereken Metod
  async deleteImage(imageURI) {
    return new Promise((resolve, reject) => {
      this.Db.transaction((tx) => {
        const query = 'DELETE FROM images WHERE imageURI = ?';
        tx.executeSql(
          query,
          [imageURI],
          (_, resultSet) => {
            resolve(resultSet);
          },
          (_, error) => {
            console.log('Error deleting image:', error);
            reject(error);
          },
        );
      });
    });
  }

  // Zaman Aralığı Silmek İçin Gereken Metod
  async deleteTimeRange(startTime, endTime) {
    return new Promise((resolve, reject) => {
      this.Db.transaction((tx) => {
        const query = 'DELETE FROM time_ranges WHERE start_time = ? AND end_time = ?';
        tx.executeSql(
          query,
          [startTime, endTime],
          (_, resultSet) => {
            resolve(resultSet);
          },
          (_, error) => {
            console.log('Error deleting time range:', error);
            reject(error);
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

  async findMatchingTimeRange(start_time, end_time) {
    return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
        const query = `
          SELECT * FROM time_ranges
          WHERE start_time <= ? AND end_time >= ?;
        `;
        tx.executeSql(
          query,
          [start_time, end_time],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows.item(0));
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            console.log('Error fetching matching time range:', error);
            reject(error);
          },
        );
      });
    });
  }
  
  async getTimeRange() {
    return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
        const query = `
          SELECT * FROM time_ranges;
        `;
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              let timeRanges = [];
              for (let i = 0; i < results.rows.length; i++) {
                timeRanges.push(results.rows.item(i));
              }
              resolve(timeRanges);
            } else {
              resolve([]);
            }
          },
          (tx, error) => {
            console.log('Error fetching time ranges:', error);
            reject(error);
          },
        );
      });
    });
  }
  
  async getImageForTimeRange(timeRangeId) {
    return new Promise((resolve, reject) => {
      this.Db.transaction(tx => {
        const query = `
          SELECT images.imageURI
          FROM time_ranges
          INNER JOIN images ON time_ranges.image_id = images.id
          WHERE time_ranges.id = ?;
        `;
        tx.executeSql(
          query,
          [timeRangeId],
          (tx, results) => {
            if (results.rows.length > 0) {
              const {imageURI} = results.rows.item(0);
              resolve(imageURI);
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            console.log('Error fetching image for time range:', error);
            reject(error);
          },
        );
      });
    });
  }

}

module.exports = Db;
