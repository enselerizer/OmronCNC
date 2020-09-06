import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataModelService } from '../data-model.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private dm: DataModelService, private cd: ChangeDetectorRef) { }

  data: any;
  cmd: string;

  ngOnInit() {
    this.dm.data.subscribe((data) => {
      this.data = data;
      if(!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
  }

  onChanges(event, val = null, reg = null) {
    if(!reg) {
      this.dm.update(this.data);
    }else {
      const regexp = new RegExp(reg);
      if(val.match(regexp) != null) {
        this.dm.update(this.data);
      }
    }
  }

  connectToController() {
    this.dm.connectToController();
  }

  disconnectFromController() {
    this.dm.disconnectFromController();
  }

  sendToController() {
    this.dm.sendToController(this.cmd);
  }

  clearConsole() {
    this.dm.clearConsole();
  }
}
