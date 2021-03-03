const { google } = require('googleapis');
const sheets = google.sheets('v4');

const {
  GOOGLE_SHEETS_API_KEY,
  GOOGLE_SHEETS_SHEET_ID,
  GOOGLE_SHEETS_RANGE_ZIP_IT,
  GOOGLE_SHEETS_RANGE_PRICES_IT,
  GOOGLE_SHEETS_RANGE_DELIVERY_IT,
  GOOGLE_SHEETS_RANGE_ZIP_SI,
  GOOGLE_SHEETS_RANGE_PRICES_SI,
  GOOGLE_SHEETS_RANGE_DELIVERY_SI,
  DELIVERY_PRICE_MULTIPLIER_ECONOMY,
  DELIVERY_PRICE_MULTIPLIER_STANDARD,
  DELIVERY_PRICE_MULTIPLIER_EXPRESS,
} = process.env;

exports.handler = function(event, context, callback) {
  sheets.spreadsheets.values.batchGet(
    {
      spreadsheetId: GOOGLE_SHEETS_SHEET_ID,
      key: GOOGLE_SHEETS_API_KEY,
      ranges: [
        GOOGLE_SHEETS_RANGE_ZIP_IT,
        GOOGLE_SHEETS_RANGE_PRICES_IT,
        GOOGLE_SHEETS_RANGE_DELIVERY_IT,
        GOOGLE_SHEETS_RANGE_ZIP_SI,
        GOOGLE_SHEETS_RANGE_PRICES_SI,
        GOOGLE_SHEETS_RANGE_DELIVERY_SI,
      ],
    },
    (error, response) => {
      if (error) {
        return callback(null, {
          statusCode: error.code,
          body: JSON.stringify({ error: error.errors[0] }),
        });
      }

      const ranges = response.data.valueRanges;
      const data = ranges.map(range => range.values);
      const [itZips, itPrices, itDelivery, siZips, siPrices, siDelivery] = data;

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          data: {
            it: {
              zips: itZips,
              prices: itPrices,
              leadTimes: itDelivery,
            },
            si: {
              zips: siZips,
              prices: siPrices,
              leadTimes: siDelivery,
            },
          },
        }),
      });
    }
  );
};
