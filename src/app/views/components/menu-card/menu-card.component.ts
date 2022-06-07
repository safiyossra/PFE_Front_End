import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'my-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent implements OnInit {

  @Input() background = 'bg-white'
  @Input() underlineColor = 'bg-info'
  @Input() title
  @Input() subtitle
  @Input() icon

  textMuted = 'text-muted'

  constructor() { }

  ngOnInit(): void {

  }

  mouseover(event: any) {
    this.background = this.underlineColor
    this.underlineColor = 'bg-white'
    this.textMuted = ''

  }

  mouseout(event: any) {
    this.underlineColor = this.background
    this.background = 'bg-white'
    this.textMuted = 'text-muted'

  }

}
