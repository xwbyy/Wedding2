import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let sheets, isSheetsInitialized = false;

async function initializeSheets() {
  try {
    // Handle newline characters in private key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY ? 
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_SHEET_ID) {
      console.error('❌ Missing required Google Sheets environment variables');
      isSheetsInitialized = false;
      return;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.GOOGLE_CLIENT_EMAIL
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    sheets = google.sheets({ version: 'v4', auth: authClient });

    await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'myuser2!A1:A1',
    });

    isSheetsInitialized = true;
    console.log('✅ Google Sheets terhubung');
  } catch (err) {
    console.error('❌ Gagal konek Google Sheets:', err.message);
    isSheetsInitialized = false;
  }
}

initializeSheets();

// In-memory storage for development/fallback
let localRSVPData = [];

function checkSheets(req, res, next) {
  if (!isSheetsInitialized) {
    console.log('📝 Using local storage as Google Sheets is not available');
    req.useLocalStorage = true;
  }
  next();
}

app.post('/api/rsvp', checkSheets, async (req, res) => {
  try {
    const { name, attendance, message } = req.body;
    if (!name || !attendance) return res.status(400).json({ error: 'Nama & Kehadiran wajib diisi' });

    const rsvpData = {
      name,
      attendance,
      message: message || '',
      timestamp: new Date().toLocaleString('id-ID')
    };

    if (req.useLocalStorage) {
      // Store locally if Google Sheets not available
      localRSVPData.push(rsvpData);
      console.log('✅ RSVP saved locally:', rsvpData);
    } else {
      // Use Google Sheets if available
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'myuser2!A:D',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            rsvpData.name,
            rsvpData.attendance,
            rsvpData.message,
            rsvpData.timestamp
          ]]
        }
      });
      console.log('✅ RSVP saved to Google Sheets:', rsvpData);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error simpan RSVP:', err.message);
    res.status(500).json({ error: 'Gagal simpan RSVP' });
  }
});

app.get('/api/responses', checkSheets, async (req, res) => {
  try {
    if (req.useLocalStorage) {
      // Return local data if Google Sheets not available
      res.json(localRSVPData);
      return;
    }
    
    // Use Google Sheets if available
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'myuser2!A:D',
    });
    const rows = response.data.values || [];
    const start = rows[0] && (rows[0][0] === 'Name' || rows[0][0] === 'Nama') ? 1 : 0;
    res.json(rows.slice(start).map(r => ({
      name: r[0] || '',
      attendance: r[1] || '',
      message: r[2] || '',
      timestamp: r[3] || ''
    })));
  } catch (err) {
    console.error('❌ Error ambil data:', err.message);
    // Fallback to local data on error
    res.json(localRSVPData);
  }
});

// New API endpoint to serve all available images
app.get('/api/images', (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'public', 'assets', 'images');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    if (!fs.existsSync(imagesDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(imagesDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => ({
        name: file,
        path: `/assets/images/${file}`,
        fullPath: path.join(imagesDir, file)
      }))
      .filter(img => {
        // Filter out directories and ensure it's a file
        try {
          return fs.statSync(img.fullPath).isFile();
        } catch (e) {
          return false;
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(files.map(img => ({ name: img.name, path: img.path })));
  } catch (err) {
    console.error('❌ Error loading images:', err.message);
    res.status(500).json({ error: 'Failed to load images' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', sheetsInitialized: isSheetsInitialized, timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => console.log(`🚀 Server jalan di port ${port}`));

setInterval(() => { if (!isSheetsInitialized) initializeSheets(); }, 30000);