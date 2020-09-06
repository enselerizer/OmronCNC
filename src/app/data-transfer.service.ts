import { Injectable, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const electron = (<any>window).require('electron');

const protoConnection = {
  status: {
    connected: false
  }
};


@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor() { }

  public connection: BehaviorSubject<any> = new BehaviorSubject<any>(protoConnection);
  public receivedMsg: BehaviorSubject<string> = new BehaviorSubject<string>('');

  init() {
    electron.ipcRenderer.on('connectStatus', (event, data) => {
      this.connection.value.status.connected = data;
      this.update();
    });

    electron.ipcRenderer.on('cnc_ReceivedFromController', (event, msg) => {
      this.receivedMsg.next(msg);
    });
  }

  update(newConnection = null) {
    if(newConnection == null) {
      this.connection.next(this.connection.value);
    } else {
      this.connection.next(newConnection);
    }
  }

  async sendToController(string) {
    electron.ipcRenderer.send('cnc_SendToController', string);
  }

  async connectToController(data) {
    electron.ipcRenderer.send('connectToController', data);
  }

  async disconnectFromController() {
    electron.ipcRenderer.send('disconnectFromController');
  }
}
