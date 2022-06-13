import { DOCUMENT } from '@angular/common';
import { HostListener, Inject } from '@angular/core'
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class util {

    isFullScreen: boolean;

    constructor(@Inject(DOCUMENT) private document: any,) {
        document.onfullscreenchange = ($event) => this.chkScreenMode($event.target['id']);

    }

    public openFullscreen(elem: any) {
        // console.log(elem);

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }
    /* Close fullscreen */
    public closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
    }


    chkScreenMode(id) {
        // var idElem = (id == 'map') || (id == 'mapDetail') ? id+'fullScreenControl' : 'list-fullscreenControl'
        var idElem = id + 'fullScreenControl'
        var fullScreenCtl = document.getElementById(idElem)
        if (document.fullscreenElement) {
            //fullscreen
            fullScreenCtl.style.backgroundPosition = "64% 96%";
            fullScreenCtl.setAttribute("title", "Exit FullScreen");
            this.isFullScreen = true;
        } else {
            //not in full screen
            fullScreenCtl.style.backgroundPosition = "55% 2%";
            fullScreenCtl.setAttribute("title", "Enter FullScreen");
            this.isFullScreen = false;
        }
    }
}