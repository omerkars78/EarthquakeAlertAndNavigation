// import {openDatabase} from 'react-native-sqlite-storage';
// import RNFS from 'react-native-fs';
// import {Platform} from 'react-native';

// class Db {
//   constructor() {
//     this.Db = openDatabase({
//       name: 'beacon79.db',
//       location: 'default',
//     });
//     this.createCheckTable();
//     this.addCheckValue(); // Uygulama ilk çalıştığında checkValue değerini 0 olarak oluşturur
//     this.checking();

//   }

//   async checking() {
//     let DefaultData = await this.getDefaultCheckValue();
//     if (DefaultData == 0) {
//       this.createMainRoutesTable();
//       this.createRoutesTable();
//       this.importCsvData('mainRoutes.csv', 'mainRoutes');
//       this.importCsvData('routes.csv', 'routes');
//       this.updateCheckValue(); this.Db.transaction(tx => {
//         tx.executeSql('PRAGMA foreign_keys = ON;', [], (tx, results) => {
//           console.log('Foreign key constraints enabled');
//         });})
     
//     }
//   }

//   async importCsvData(csvFileName, tableName) {
//     const assetPath = Platform.select({
//       ios: `${RNFS.MainBundlePath}/${csvFileName}`,
//       android: `${RNFS.DocumentDirectoryPath}/${csvFileName}`,
//     });

//     try {
//       await RNFS.copyFileAssets(csvFileName, assetPath);
//       const data = await RNFS.readFile(assetPath, 'utf8');
//       const records = data.trim().split('\n');
//       const headers = records[0].split(',');

//       // Remove the header row
//       records.shift();

//       for (const record of records) {
//         const fields = record.split(',');
//         const fieldData = {};

//         fields.forEach((field, index) => {
//           fieldData[headers[index]] = field;
//         });

//         await this.insertData(tableName, fieldData);
//       }
//     } catch (error) {
//       console.error('Error importing CSV data:', error);
//     }
//   }

//   insertData(tableName, fieldData) {
//     const fields = Object.keys(fieldData).join(', ');
//     const values = Object.values(fieldData)
//       .map(value => `'${value}'`)
//       .join(', ');
//     const query = `INSERT INTO ${tableName} (${fields}) VALUES (${values});`;

//     return new Promise((resolve, reject) => {
//       this.Db.transaction(txn => {
//         txn.executeSql(
//           query,
//           [],
//           (tx, res) => {
//             console.log(
//               `Data inserted into ${tableName} successfully, ID: ${res.insertId}`,
//             );
//             resolve();
//           },
//           (tx, error) => {
//             console.log(
//               `Error inserting data into ${tableName}:`,
//               error.message,
//             );
//             reject();
//           },
//         );
//       });
//     });
//   }
//   // En başta 0 olarak oluşturulan default değeri işlem sonunda 1 yapmamızı sağlayacak metod
//   updateCheckValue() {
//     const query = `UPDATE checkTable SET checkValue = 1`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('Check value updated successfully');
//       });
//     });
//   }
//   // CheckValue değerini kontrol etmemizi sağlayacak metod
//   async getDefaultCheckValue() {
//     const query = 'SELECT checkValue FROM checkTable;';
//     return new Promise((resolve, reject) => {
//       this.Db.transaction(function (txn) {
//         txn.executeSql(query, [], function (tx, res) {
//           if (res.rows.length > 0) {
//             const checkValue = res.rows.item(0).checkValue;
//             resolve(checkValue);
//             console.log(checkValue);
//           } else {
//             console.log('No data to display 1 ');
//           }
//         });
//       });
//     });
//   }
//   // Uygulama İlk Çalıştığında Default Verileri Eklemeden Önce Kontrol Yapmamızı Sağlayacak Tablo
//   createCheckTable() {
//     const query = `CREATE TABLE IF NOT EXISTS checkTable(
//         checkValue INTEGER DEFAULT 0
//     )`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('Check table created successfully');
//       });
//     });
//   }
//   // ChechkValue değerine 0 değerini eklememizi sağlayacak metod
//   addCheckValue() {
//     const query = `INSERT INTO checkTable (checkValue) VALUES (0)`; // 0 değerini default olarak eklemek için DEFAULT kullanıldı
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('Check value added successfully');
//       });
//     });
//   }

//   //****************************  BİNA İÇİ YÖNLENDİRME VE ACİL ÇIKIŞ İÇİN **************************************************//

//   // acil çıkış ve bina içi yönlendirme için oluşturuduğumuz bir tablo
//   createMainRoutesTable() {
//     const query = `CREATE TABLE IF NOT EXISTS mainRoutes(
//             id INTEGER PRIMARY KEY NOT NULL,
//             startMajor CHAR(4) NOT NULL,
//             startMinor CHAR(4) NOT NULL,
//             finishMajor CHAR(4) NOT NULL,
//             finishMinor CHAR(4) NOT NULL
//         );`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('Main routes table created successfully');
//       });
//     });
//   }

//   // acil çıkış ve bina içi yönlendirme için oluşturuduğumuz bir tablo
//   createRoutesTable() {
//     const query = `CREATE TABLE IF NOT EXISTS routes(
//             id INTEGER PRIMARY KEY NOT NULL,
//             mainRouteId INTEGER NOT NULL,
//             curMajor CHAR(4) NOT NULL,
//             curMinor CHAR(4) NOT NULL,
//             nextMajor CHAR(4)  NOT NULL,
//             nextMinor CHAR(4) NOT  NULL,
//             nextDirection CHAR(100) NOT NULL,
//             nextDistance DOUBLE NOT NULL,
//             beforeMajor CHAR(4) NOT NULL,
//             beforeMinor CHAR(4) NOT NULL,
//             beforeDirection CHAR(100) NOT NULL,
//             beforeDistance DOUBLE NOT NULL,
//             nextText CHAR(100) NOT NULL,
//             FOREIGN KEY (mainRouteId) REFERENCES mainRoutes(id)
//         );`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('Routes table created successfully');
//       });
//     });
//   }

//   // Main rotları Ekleme Metodu
//   addMainRoute(startMajor, startMinor, finishMajor, finishMinor) {
//     const query = `INSERT INTO mainRoutes (startMajor, startMinor, finishMajor, finishMinor) VALUES (?,?,?,?);`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(
//         query,
//         [startMajor, startMinor, finishMajor, finishMinor],
//         function (tx, res) {
//           console.log(`Main route added successfully, ID: ${res.insertId}`);
//         },
//       );
//     });
//   }

//   // Normal rotaları ekleme metodu
//   addRoute(
//     mainRouteId,
//     curMajor,
//     curMinor,
//     nextMajor,
//     nextMinor,
//     nextDirection,
//     nextDistance,
//     beforeMajor,
//     beforeMinor,
//     beforeDirection,
//     beforeDistance,
//     nextText,
//   ) {
//     const query = `INSERT INTO routes (mainRouteId, curMajor, curMinor, nextMajor, nextMinor, nextDirection, nextDistance, beforeMajor, beforeMinor, beforeDirection, beforeDistance,nextText) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;
//     this.Db.transaction(function (txn) {
//       txn.executeSql(
//         query,
//         [
//           mainRouteId,
//           curMajor,
//           curMinor,
//           nextMajor,
//           nextMinor,
//           nextDirection,
//           nextDistance,
//           beforeMajor,
//           beforeMinor,
//           beforeDirection,
//           beforeDistance,
//           nextText,
//         ],
//         function (tx, res) {
//           console.log(`Route added successfully, ID: ${res.insertId}`);
//         },
//       );
//     });
//   }

//   // Yönlendirme oklarını güncelleme metodu
//   updateDirections(
//     mainRouteId,
//     oldBeforeDirection,
//     newBeforeDirection,
//     oldNextDirection,
//     newNextDirection,
//   ) {
//     const query = `
//         UPDATE routes
//         SET beforeDirection = CASE WHEN beforeDirection = ? THEN ? ELSE beforeDirection END,
//             nextDirection = CASE WHEN nextDirection = ? THEN ? ELSE nextDirection END
//         WHERE mainRouteId = ?;
//       `;

//     this.Db.transaction(txn => {
//       txn.executeSql(
//         query,
//         [
//           oldBeforeDirection,
//           newBeforeDirection,
//           oldNextDirection,
//           newNextDirection,
//           mainRouteId,
//         ],
//         (tx, res) => {
//           console.log(`Updated directions for mainRouteId: ${mainRouteId}`);
//         },
//         (tx, error) => {
//           console.log(`Error updating directions: ${error.message}`);
//         },
//       );
//     });
//   }

//   // Tüm detaylı rota bilgilerni alma metodu
//   async getAllRoutes(callback) {
//     const query = 'SELECT * FROM routes;';
//     return new Promise((resolve, reject) => {
//       this.Db.transaction(function (txn) {
//         txn.executeSql(query, [], function (tx, res) {
//           var data = [];
//           for (let i = 0; i < res.rows.length; i++) {
//             const element = res.rows.item(i);
//             data.push(element);
//           }
//           if (data.length > 0) {
//             resolve(data);
//             console.log(data);
//           } else {
//             console.log('No data to display');
//           }
//         });
//       });
//     });
//   }

//   // Tüm Main Rota Bilgilerini Alma Metodu
//   async getAllMainRoutes(callback) {
//     const query = `SELECT * FROM mainRoutes;`;
//     return new Promise((resolve, reject) => {
//       this.Db.transaction(txn => {
//         txn.executeSql(query, [], (tx, res) => {
//           // console.log(res.rows.length);
//           // console.log(res.rows.item(0));
//           var mainData = [];
//           for (let i = 0; i < res.rows.length; i++) {
//             const element = res.rows.item(i); // data olduğu müddetçe döngüye girer.listeye eklenir.
//             mainData.push(element);
//           }
//           resolve(mainData);
//           console.log(mainData);
//         });
//       });
//     });
//   }

//   // Hedef İle Eşleşen Rota Bilgilerini Alma Metodu
//   async searchMatchedData(startMajor, startMinor, finishMajor, finishMinor) {
//     try {
//       return new Promise((resolve, reject) => {
//         this.Db.transaction(tx => {
//           tx.executeSql(
//             'SELECT * FROM mainRoutes,routes WHERE mainRoutes.id = routes.mainRouteId AND startMajor = ? AND startMinor = ? AND finishMajor = ? AND finishMinor = ?',
//             [startMajor, startMinor, finishMajor, finishMinor],
//             (tx, results) => {
//               //array destructing
//               const [...datas] = results.rows.raw();
//               resolve(datas);
//             },
//             error => {
//               reject(error);
//             },
//           );
//         });
//       });
//     } catch (error) {
//       console.log('SQL error Bu errordur:', error);
//     }
//   }

//   // Tüm Main Rotaları Silen Metod
//   deleteAllMainRoutes() {
//     const query = 'DELETE FROM mainRoutes;';
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('All main routes deleted successfully');
//       });
//     });
//   }

//   // Tüm Detaylı Rotaları Silen Metod
//   deleteAllRoutes() {
//     const query = 'DELETE FROM routes;';
//     this.Db.transaction(function (txn) {
//       txn.executeSql(query, [], function (tx, res) {
//         console.log('All routes deleted successfully');
//       });
//     });
//   }

// }

// module.exports = Db;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {parse} from 'react-native-csv';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';
import React, {useContext} from 'react';

class Db {
  constructor() {
    this.Db = openDatabase({
      name: 'beacon3131.db',
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
      this.importJsonData('mainRoutes.json', 'mainRoutes');
      this.importJsonData('routes.json', 'routes');
      this.updateCheckValue();
    }
  }


  // Verilen JSON dosyasını okur ve belirtilen tabloya aktarır
  async importJsonData(jsonFileName, tableName) {
    // Platforma göre dosya yolu seçilir
    const assetPath = Platform.select({
      ios: `${RNFS.MainBundlePath}/${jsonFileName}`,
      android: `${RNFS.DocumentDirectoryPath}/${jsonFileName}`,
    });

    try {
      // Dosya öncelikle uygulamanın kendi hafızasına kopyalanır
      await RNFS.copyFileAssets(jsonFileName, assetPath);
      // Ardından dosya okunur
      const data = await RNFS.readFile(assetPath, 'utf8');

      // JSON dosyası JSON objesine dönüştürülür
      const records = JSON.parse(data);

      // Her bir kayıt için işlem yapılır
      for (const record of records) {
        // Hazırlanan veriyi veritabanına ekle
        await this.insertData(tableName, record);
      }
    } catch (error) {
      // Hata oluşursa konsola hata bilgisini yazdır
      console.error('JSON verisi içe aktarılırken hata:', error);
    }
  }

  // Veriyi belirtilen tabloya ekler
  insertData(tableName, fieldData) {
    // Sütun isimlerini al
    const fields = Object.keys(fieldData).join(',');
    // Her bir değer için soru işareti placeholder'ı oluştur
    const placeholders = Object.keys(fieldData)
      .map(() => '?')
      .join(',');
    // Eklenecek değerleri al
    const values = Object.values(fieldData);
    // SQL sorgusunu oluştur
    const query = `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders});`;

    // Yeni bir Promise döndür. Bu, asenkron işlemi yönetmek için kullanılır
    return new Promise((resolve, reject) => {
      // Veritabanı işlemini başlat
      this.Db.transaction(txn => {
        txn.executeSql(
          // Yukarıda oluşturulan SQL sorgusunu çalıştır
          query,
          // SQL sorgusunda yer tutucu olarak kullanılan ? karakterlerini gerçek değerlerle değiştir
          values,
          // SQL sorgusu başarılı olarak tamamlandığında çağrılacak callback fonksiyonu
          (tx, res) => {
            console.log(
              `${tableName} tablosuna başarıyla veri eklendi, ID: ${res.insertId}`,
            );
            // Promise'i başarılı olarak tamamla
            resolve();
          },
          // SQL sorgusu bir hata ile sonuçlandığında çağrılacak callback fonksiyonu
          (tx, error) => {
            console.log(
              `${tableName} tablosuna veri eklenirken hata oluştu:`,
              error.message,
            );
            // Promise'i hata ile sonlandır
            reject(error);
          },
        );
      });
    });
  }

  // Tüm Main Rotaları Silmemize Yarayan Metod
  deleteAllMainRoutes() {
    const query = 'DELETE FROM mainRoutes;';
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('All main routes deleted successfully');
      });
    });
  }

  // Tüm Rotaları Silmemize Yarayan Metod
  deleteAllRoutes() {
    const query = 'DELETE FROM routes;';
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('All routes deleted successfully');
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

  // Main Tablo Oluşturmak İçin Kullanılan Metod
  createMainRoutesTable() {
    const query = `CREATE TABLE IF NOT EXISTS mainRoutes(
              id INTEGER PRIMARY KEY NOT NULL,
              startMajor VARCHAR(4) NOT NULL,
              startMinor VARCHAR(4) NOT NULL,
              finishMajor VARCHAR(4) NOT NULL,
              finishMinor VARCHAR(4) NOT NULL
          );`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Main routes table created successfully');
      });
    });
  }

  // Rota Oluşturma İçin Kullanılan Metod
  createRoutesTable() {
    const query = `CREATE TABLE IF NOT EXISTS routes(
              id INTEGER PRIMARY KEY NOT NULL,
              mainRouteId INTEGER NOT NULL,
              curMajor VARCHAR(4) NOT NULL,
              curMinor VARCHAR(4) NOT NULL,
              nextMajor VARCHAR(4)  NOT NULL,
              nextMinor VARCHAR(4) NOT  NULL,
              nextDirection VARCHAR(20) NOT NULL,
              nextDistance INT(11) NOT NULL,
              beforeMajor VARCHAR(4) NOT NULL,
              beforeMinor VARCHAR(4) NOT NULL,
              beforeDirection VARCHAR(50) NOT NULL,
              beforeDistance INT(11) NOT NULL,
              nextText VARCHAR(255) NOT NULL,
              FOREIGN KEY (mainRouteId) REFERENCES mainRoutes(id)
          );`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [], function (tx, res) {
        console.log('Routes table created successfully');
      });
    });
  }

  // Main Rota Eklemek İçin Kullanılan Metod
  addMainRoute(startMajor, startMinor, finishMajor, finishMinor) {
    const query = `INSERT INTO mainRoutes (startMajor, startMinor, finishMajor, finishMinor) VALUES (?,?,?,?);`;
    this.Db.transaction(txn => {
      txn.executeSql(
        query,
        [startMajor, startMinor, finishMajor, finishMinor],
        (tx, res) => {
          console.log(`Main route added successfully, ID: ${res.insertId}`);
        },
      );
    });
  }

  // Rota Eklemek İçin Kullanılan Metod
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

  // Main Rota Güncellemek İçin Kullanılan Metod
  updateMainRoute(id, startMajor, startMinor, finishMajor, finishMinor) {
    const query = `UPDATE mainRoutes SET startMajor = ?, startMinor = ?, finishMajor = ?, finishMinor = ? WHERE id = ?;`;

    this.Db.transaction(function (txn) {
      txn.executeSql(
        query,
        [startMajor, startMinor, finishMajor, finishMinor, id],
        function (tx, res) {
          console.log(
            `Main route updated successfully, affected rows: ${res.rowsAffected}`,
          );
        },
        function (tx, error) {
          console.log(`Error updating main route: ${error.message}`);
        },
      );
    });
  }

  // Tüm Rotaları Çekmek İçin Kullanılan Metod
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

  // Tüm Main Rotaları Çekmek İçin Kullanılan Metod
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

  // Tüm Eşleşen Rotaları Çekmek İçin Kullanılan Metod
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

  // 'routes' tablosundan belirli bir 'id'ye göre veri çeken metod
  getRouteAtIndex(index) {
    return new Promise((resolve, reject) => {
      this.Db.transaction(function (txn) {
        txn.executeSql(
          'SELECT * FROM Routes WHERE id=?',
          [index],
          function (tx, res) {
            if (res.rows.length > 0) {
              const data = res.rows.item(0);
              resolve(data);
            } else {
              reject('No data found for index ' + index);
            }
          },
          function (tx, error) {
            // transaction error callback
            reject('Transaction error: ' + error.message);
          },
        );
      });
    });
  }

  getMainRouteAtIndex(index) {
    return new Promise((resolve, reject) => {
      this.Db.transaction(function (txn) {
        txn.executeSql(
          'SELECT * FROM MainRoutes WHERE id=?',
          [index],
          function (tx, res) {
            if (res.rows.length > 0) {
              const data = res.rows.item(0);
              resolve(data);
            } else {
              reject('No data found for index ' + index);
            }
          },
          function (tx, error) {
            // transaction error callback
            reject('Transaction error: ' + error.message);
          },
        );
      });
    });
  }
}

module.exports = Db;
