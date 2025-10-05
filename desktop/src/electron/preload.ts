import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  validateMasterKey: (key: string) => ipcRenderer.invoke('validate-master-key', key),
});
