import {Injectable} from '@angular/core'

@Injectable({
    providedIn: 'root'
})


export class Constant{

    constructor() {   }

    public timezone = [
        {
          label: "GMT+00:00",
          data: "GMT+00:00"
        },
        {
          label: "GMT+01:00",
          data: "GMT+01:00"
        },
        {
          label: "GMT+02:00",
          data: "GMT+02:00"
        },
        {
          label: "GMT+03:00",
          data: "GMT+03:00"
        },
        {
          label: "GMT+04:00",
          data: "GMT+04:00"
        },
        {
          label: "GMT+05:00",
          data: "GMT+05:00"
        },
        {
          label: "GMT+05:30",
          data: "GMT+05:30"
        },
        {
          label: "GMT+06:00",
          data: "GMT+06:00"
        },
        {
          label: "GMT+07:00",
          data: "GMT+07:00"
        },
        {
          label: "GMT+08:00",
          data: "GMT+08:00"
        },
        {
          label: "GMT+09:00",
          data: "GMT+09:00"
        },
        {
          label: "GMT+10:00",
          data: "GMT+10:00"
        },
        {
          label: "GMT+11:00",
          data: "GMT+11:00"
        },
        {
          label: "GMT+12:00",
          data: "GMT+12:00"
        },
        {
          label: "GMT+13:00",
          data: "GMT+13:00"
        },
        {
          label: "GMT+14:00",
          data: "GMT+14:00"
        },
        {
          label: "GMT-01:00",
          data: "GMT-01:00"
        },
        {
          label: "GMT-02:00",
          data: "GMT-02:00"
        },
        {
          label: "GMT-03:00",
          data: "GMT-03:00"
        },
        {
          label: "GMT-04:00",
          data: "GMT-04:00"
        },
        {
          label: "GMT-05:00",
          data: "GMT-05:00"
        },
        {
          label: "GMT-06:00",
          data: "GMT-06:00"
        },
        {
          label: "GMT-07:00",
          data: "GMT-07:00"
        },
        {
          label: "GMT-08:00",
          data: "GMT-08:00"
        },
        {
          label: "GMT-09:00",
          data: "GMT-09:00"
        },
        {
          label: "GMT-10:00",
          data: "GMT-10:00"
        },
        {
          label: "GMT-11:00",
          data: "GMT-11:00"
        },
        {
          label: "GMT-12:00",
          data: "GMT-12:00"
        },
        {
          label: "US/Hawaii",
          data: "US/Hawaii"
        },
        {
          label: "US/Alaska",
          data: "US/Alaska"
        },
        {
          label: "US/Pacific",
          data: "US/Pacific"
        },
        {
          label: "US/Arizona",
          data: "US/Arizona"
        },
        {
          label: "US/Mountain",
          data: "US/Mountain"
        },
        {
          label: "US/Central",
          data: "US/Central"
        },
        {
          label: "US/Eastern",
          data: "US/Eastern"
        },    
        {
          label: "Canada/Pacific",
          data: "Canada/Pacific"
        },
        {
          label: "Canada/Mountain",
          data: "Canada/Mountain"
        },
        {
          label: "Canada/Central",
          data: "Canada/Central"
        },
        {
          label: "Canada/Eastern",
          data: "Canada/Eastern"
        },   
        {
          label: "Canada/Atlantic",
          data: "Canada/Atlantic"
        },
        {
          label: "Mexico/BajaNorte",
          data: "Mexico/BajaNorte"
        },   
        {
          label: "Mexico/BajaSur",
          data: "Mexico/BajaSur"
        },
        {
          label: "Mexico/General",
          data: "Mexico/General"
        },
        {
          label: "Europe/Athens",
          data: "Europe/Athens"
        },
        {
          label: "Europe/Berlin",
          data: "Europe/Berlin"
        },
    
        {
          label: "Europe/Dublin",
          data: "Europe/Dublin"
        },
        {
          label: "Europe/Helsinki",
          data: "Europe/Helsinki"
        },
        {
          label: "Europe/Kiev",
          data: "Europe/Kiev"
        },
        {
          label: "Europe/Lisbon",
          data: "Europe/Lisbon"
        },
        {
          label: "Europe/London",
          data: "Europe/London"
        },
        {
          label: "Europe/Madrid",
          data: "Europe/Madrid"
        },
        {
          label: "Europe/Moscow",
          data: "Europe/Moscow"
        },
        {
          label: "Europe/Oslo",
          data: "Europe/Oslo"
        },
        {
          label: "Europe/Paris",
          data: "Europe/Paris"
        },
        {
          label: "Europe/Rome",
          data: "Europe/Rome"
        },
        {
          label: "Europe/Stockholm",
          data: "Europe/Stockholm"
        },
        {
          label: "Europe/Zurich",
          data: "Europe/Zurich"
        },
        {
          label: "Pacific/Auckland",
          data: "Pacific/Auckland"
        },
        {
          label: " Pacific/Chatham",
          data: " Pacific/Chatham"
        },    
      ];

motor = ["moto", "grnbike",]
    camions = ['fleetGreen', 'fleet', 'ffight', 'yeltruck', 'blktruck', 'rgntruck', 'excav', 'grua', 'h100', 'mzcldr', 'pickup',]
    remorque = ["trailer"]
    sprinter = ['bus']
    truck = ["remolque", "volvo1",]
    truck_head = ['volvo2']
    // cars = ["", "black","brown","red","orange","yellow","green", "blue", "purple", "gray", "white", "darkred", "darkgreen", "darkblue", "darkpurple", "teal", 
    // "salmon", "gold", "pink", "lime", "bluegray", "magenta", "reddot", "greendot", "bluedot", "stop", "slow", "moving", 
    // "last", "greenh", "yellowh", "heading", "lastlabel", "lastage", "devlabel", "devlbl_r", "devlbl_g", "devlbl_b", "devlbl_y", "pp_arrow_c", 
    // "pp_arrow_y", "arrow_spd", "arrow_grn", "indexed", "4x4", "medi", "bcar", "rcar", "rgray", "banco", "rflag", "burro", 
    // "dino", "fabrica", "farmacia", "gas", "home", "hospital", "milenium", "naboo", "patito", "persona", "peru", "pinguino", "policia", "probox", "r2d2", 
    // "raton", "sniper", "taxi", "templo", "tibirium", "tiefight",  "tren", "xwing"]
}