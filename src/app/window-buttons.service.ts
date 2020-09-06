import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class WindowButtonsService {

  constructor() { }

  isMaximized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  init() {
    electron.ipcRenderer.on('windowStatusChanged', (event, arg) => {
      this.isMaximized.next(arg);
    });
  }
  close() {
    electron.ipcRenderer.send('windowClose');
  }
  minimize() {
    electron.ipcRenderer.send('windowMinimize');
  }
  toggleMaximize() {
    if(this.isMaximized.getValue()) {
      electron.ipcRenderer.send('windowUnmaximize');
    } else {
      electron.ipcRenderer.send('windowMaximize');
    }
  }
}
