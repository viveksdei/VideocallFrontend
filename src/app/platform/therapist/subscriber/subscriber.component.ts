import { AfterViewInit, Component, ElementRef,  Input,  ViewChild } from '@angular/core';
import * as OT from "@opentok/client";
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.scss'
})
export class SubscriberComponent implements AfterViewInit {
  @ViewChild("subscriberDiv") subscriberDiv!: ElementRef;
  @Input() session!: OT.Session;
  @Input() stream!: OT.Stream;
  @Input() index!: number;
  ngAfterViewInit() {
    console.log("20 ngafter  is called from subscriber  ");
    const subscriber = this.session.subscribe(
      this.stream,
      this.subscriberDiv.nativeElement,
      {
        insertMode: "append",
        width: "700px",
        height: "500px",
        showControls: true
      },
      err => {
        if (err) {
          console.log(err.message);
          
        }
      }
    );
  }
}
