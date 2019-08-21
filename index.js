require('dotenv').config();
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const table = require('markdown-table');

const doc = new GoogleSpreadsheet(process.env['GOOGLE_SHEET_ID']);
let sheet;
const data = [];

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
      sheet = info.worksheets[0];

      step();
    });
  },
  function getCells(step) {
    doc.getCells(sheet.id, function(err, cells) {
      cells.map(c => {
        const x = c.col - 1;
        const y = c.row - 1;
        if (!Array.isArray(data[y])) {
          data[y] = [];
        }
        data[y][x] = c.value;
      });

      step();
    });
  },
  function makeTable(step) {
    const md = table(data);
    console.log(md);
  },
]);
