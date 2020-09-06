import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { DataTransferService } from './data-transfer.service';

const protoData = {
  ipconfig: {
    ip: '192.168.1.200',
    port: '8000'
  },
  status: {
    connected: false
  },
  console: ''
};




@Injectable({
  providedIn: 'root'
})
export class DataModelService {

  public data: BehaviorSubject<any> = new BehaviorSubject<any>(protoData);

  constructor(
    private router: Router,
    private dt: DataTransferService
  ) {}

  init() {
    this.dt.connection.subscribe((data) => {
      this.data.value.status.connected = data.status.connected;
      if(data.status.connected) {
        this.logToConsole('[TCP/IP] Controller online on ' + this.data.value.ipconfig.ip + ':' + this.data.value.ipconfig.port + ', waiting for commands');
      } else {
        this.logToConsole('[TCP/IP] Controller offline');
      }
      this.update();
    });

    this.dt.receivedMsg.subscribe((msg) => {
      this.receivedFromController(msg);
    });

    this.dt.init();
  }

  update(newData = null) {
    if(newData == null) {
      this.data.next(this.data.value);
    } else {
      this.data.next(newData);
    }
  }

  logToConsole(string) {
    this.data.value.console += string + '\n';
    this.update();
  } 

  clearConsole() {
    this.data.value.console = '';
    this.update();
  }


  connectToController() {
    this.dt.connectToController(this.data.value);
  }

  disconnectFromController() {
    this.dt.disconnectFromController();
  }

  sendToController(string) {
    this.dt.sendToController(string);
    this.logToConsole('[CtrPanel -----> OmronCNC] ' + string);
  }

  receivedFromController(string) {
    this.logToConsole('[CtrPanel <----- OmronCNC] ' + string);
  }
}
