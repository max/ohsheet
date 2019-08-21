require('dotenv').config();
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');

const doc = new GoogleSpreadsheet(process.env['GOOGLE_SHEET_ID']);
let sheet;

async.series([
  function setAuth(step) {
    const creds = {
      client_email: process.env['GOOGLE_CLIENT_EMAIL'],
      private_key: process.env['GOOGLE_PRIVATE_KEY'],
    };

    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log(`Loaded doc: ${info.title} by ${info.author.email}`);
      sheet = info.worksheets[0];
      console.log(
        `Sheet 1: ${sheet.title} ${sheet.rowCount}x${sheet.colCount}`,
      );
      step();
    });
  },
]);
