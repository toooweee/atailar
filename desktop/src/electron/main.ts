import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as keytar from 'keytar';
import { SERVICE_NAME, ACCOUNT_NAME } from './constants.js';
import isDev from './util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.whenReady().then(async () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev()) {
    await mainWindow.loadURL('http://localhost:5123');
    mainWindow.webContents.openDevTools(); // DevTools
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist-react/index.html'));
  }
});

ipcMain.handle('validate-master-key', async (event, inputKey: string) => {
  try {
    const storedKey = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);

    if (!storedKey) {
      await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, inputKey);
      return { valid: true, hasKey: false, message: 'Ключ установлен' };
    }

    const valid = storedKey === inputKey;
    return { valid, hasKey: true, message: valid ? 'Доступ разрешён' : 'Неверный ключ' };
  } catch (err) {
    console.error('Keytar error:', err);
    return {
      valid: false,
      error: 'Keychain недоступен. Проверьте системные настройки (Windows Credential Manager).',
      hasKey: false,
    };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
