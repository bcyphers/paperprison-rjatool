import { google } from 'googleapis';
import axios from 'axios';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, email, feedback } = req.body;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = 'Sheet1';

  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Get the current number of rows in the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:A`,
    });

    const rows = response.data.values || [];
    const nextSno = rows.length + 1;

    const currentDate = getCurrentDate();

    // Append the new row with Sno
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nextSno, name, email, feedback, currentDate]],
      },
    });

    console.log('Google Sheets API response:', result.data);

    if (result.status === 200) {
      res.status(200).json({ message: 'Feedback submitted successfully' });
    } else {
      throw new Error('Failed to submit feedback');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error submitting feedback', details: error.message });
  }
}