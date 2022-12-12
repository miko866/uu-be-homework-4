const createDummyData = require('./src/controllers/seeder-controller');

module.exports = async function () {
  createDummyData();
};
