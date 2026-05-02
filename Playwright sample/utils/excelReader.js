const XLSX = require('xlsx');
const fs = require('fs');

function getData(filePath) {
  console.log('Reading file from:', filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error('File NOT found: ' + filePath);
  }

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = { getData };