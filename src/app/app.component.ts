import { Component, ChangeDetectorRef } from '@angular/core';
import { DataModelService } from './data-model.service';
import { DataTransferService } from './data-transfer.service';
import { WindowButtonsService } from './window-buttons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OmronCNC';

  isMaximized = false;
  status: any;
  wbRef: any;

  constructor(private dm: DataModelService, private cd: ChangeDetectorRef, private wb: WindowButtonsService, private dt:DataTransferService) {}

  ngOnInit() {
    this.wbRef = this.wb;
    this.wb.init();
    this.wb.isMaximized.subscribe((val) => {
      this.isMaximized = val;
      this.cd.detectChanges();
    });
    this.dm.init();
  }

}
