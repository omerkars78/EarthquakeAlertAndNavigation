const openDatabase = require('react-native-sqlite-storage').openDatabase;
class Db {
  constructor() {
    this.Db = openDatabase({
      name: 'beacon3.db',
      location: 'default',
    });
    this.createMainRoutesTable();
    this.createRoutesTable();
    this.createImagesTable();
  }

  getDb() {
    return console.log(this.Db);
  }

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

  // fotoğraf yüklenirken kullanılacak
  addImage(imageURI) {
    const query = `INSERT INTO images (imageURI) VALUES (?);`;
    this.Db.transaction(function (txn) {
      txn.executeSql(query, [imageURI], function (tx, res) {
        console.log(`Image added successfully, ID: ${res.insertId}`);
      });
    });
  }

    
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

  updateDirections(mainRouteId, oldBeforeDirection, newBeforeDirection, oldNextDirection, newNextDirection) {
    const query = `
      UPDATE routes
      SET beforeDirection = CASE WHEN beforeDirection = ? THEN ? ELSE beforeDirection END,
          nextDirection = CASE WHEN nextDirection = ? THEN ? ELSE nextDirection END
      WHERE mainRouteId = ?;
    `;
  
    this.Db.transaction((txn) => {
      txn.executeSql(
        query,
        [oldBeforeDirection, newBeforeDirection, oldNextDirection, newNextDirection, mainRouteId],
        (tx, res) => {
          console.log(`Updated directions for mainRouteId: ${mainRouteId}`);
        },
        (tx, error) => {
          console.log(`Error updating directions: ${error.message}`);
        }
      );
    });
  }
  
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
            (error) => {reject(error)}
          );
        });
      });

    } catch (error) {
      console.log('SQL error Bu errordur:', error);
    }
  }
}

module.exports = Db;
