import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'file-uploader',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class FileUploader implements OnChanges {
  constructor(private dataService: DataService, private router: Router,) { }
  files: any[] = [];

  @Input() id = ""
  @Input() table = ""
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    const file = this.files[index];
    this.deleteFiles(file.id);
    this.files.splice(index, 1);
  }

  uploadFiles(index) {
    var route = this.router
    var extra = "?id_foreign=" + this.id + "&table=" + this.table
    this.dataService.upload(this.files[index], extra).subscribe({
      next: (res: any) => {
        console.log(res);
        this.files[index].finished = true
        this.files[index].id = res.id
      }, error(err) {
        console.log(err);
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  deleteFiles(id) {
    var route = this.router
    this.dataService.deleteFile(id).subscribe({
      next: (d: any) => {
      }, error(err) {
        console.log(err);
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  prepareFilesList(files: Array<any>) {
    for (var item of files) {
      item.finished = false;
      this.files.push(item);
    }
    this.files.forEach((e, i) => {
      if (!e.finished)
        this.uploadFiles(i);
    })
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      let change = changes['id'].currentValue
      if (change) {
        this.id = change;
      }
    }
    if (changes['table']) {
      let change = changes['table'].currentValue
      if (change != "") {
        this.loadData();
      }
    }
  }

  loadData() {
    var route = this.router
    var urlTmp = "?id_foreign=" + this.id + "&table=" + this.table
    this.dataService.getDocsUrl(urlTmp).subscribe({
      next: (d: any) => {
        console.log("d ", d);
        var tmp = []
        d.forEach((e, i) => {
          tmp.push({
            finished: true, id: e.id, name: e.file_name,
            file_url: e.file_url, size: e.file_size, file_type: e.file_type
          })
        });
        this.files = tmp
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    });
  }

  showDocument(file) {
    if (file.file_url != null && file.file_url != "")
      window.open(file.file_url, "_blank");
  }
}
