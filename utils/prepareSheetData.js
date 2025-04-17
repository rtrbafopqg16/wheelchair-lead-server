// utils/prepareSheetData.js

function prepareSheetData(requestBody) {
    const sheetData = {};
  
    sheetData.firstName = requestBody.firstName || "";
    sheetData.lastName = requestBody.lastName || "";
  
    if (requestBody.phoneNumbers && requestBody.phoneNumbers.length > 0) {
      sheetData.phone = requestBody.phoneNumbers[0].value || "";
    } else {
      sheetData.phone = "";
    }
  
    if (requestBody.emails && requestBody.emails.length > 0) {
      sheetData.email = requestBody.emails[0].value || "";
    } else {
      sheetData.email = "";
    }
  
    sheetData.source = requestBody.source || "";
    sheetData.utmSource = requestBody.utmSource || "";
    sheetData.utmCampaign = requestBody.utmCampaign || "";
    sheetData.utmMedium = requestBody.utmMedium || "";
    sheetData.utmContent = requestBody.utmContent || "";
    sheetData.utmTerm = requestBody.utmTerm || "";
  
    if (requestBody.customFieldValues) {
      Object.keys(requestBody.customFieldValues).forEach(key => {
        const newKey = key.replace(/^cf/, '').charAt(0).toLowerCase() + key.replace(/^cf/, '').slice(1);
        sheetData[newKey] = requestBody.customFieldValues[key];
      });
    }
  
    sheetData.timestamp = new Date().toISOString();
  
    return sheetData;
  }
  
  module.exports = prepareSheetData;
  