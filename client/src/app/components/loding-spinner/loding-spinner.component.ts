import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loding-spinner',
  templateUrl: './loding-spinner.component.html'
})
export class LodingSpinnerComponent implements OnInit {

  @Input() isBig: boolean = false;
  @Input() isMedium: boolean = false;
  @Input() isSmall: boolean = true;

  SizeCLass: string;
  constructor() { 
    this.SizeCLass = `${this.isSmall ? 'w-4 h-4' : this.isMedium ? 'w-8 h-8' : this.isBig && 'w-16 h-16'} inline mr-2 text-gray-200 animate-spin fill-blue-600`
  }

  ngOnInit(): void {
  }

}
