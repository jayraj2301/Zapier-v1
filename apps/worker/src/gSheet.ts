import { google } from "googleapis";
import path from "path";

// async function _getGoogleSheetClient() {
//   const auth = await new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });
//   const authClient = await auth.getClient();
//   return google.sheets({
//     version: 'v4',
//     auth: authClient,
//   });
// }

export async function logToGoogleSheet(data: {
  username: string;
  body: string;
}) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "credentials.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const authClient = await auth.getClient();
    //@ts-ignore
    const sheets = google.sheets({ version: "v4", auth: authClient });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    // console.log("ENV ",spreadsheetId, process.env.GOOGLE_SHEET_ID);
    
    const values = [[data.username, data.body, new Date().toISOString]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      requestBody: { values },
    });
  } catch (err) {
    console.log(err);
  }
}
