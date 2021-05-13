import { Component } from "@angular/core";
import { TaskService } from "~/app/task.service";
import { DatePipe } from '@angular/common'
import { Location } from '@angular/common'
import * as camera from "@nativescript/camera";
import { ImageAsset, Button, EventData, Color } from "@nativescript/core";
import { ImageSource, knownFolders} from '@nativescript/core';
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import * as imagepicker from "@nativescript/imagepicker";
import { Router } from "@angular/router";

@Component ({
    selector: "add-task",
    templateUrl: "./add-task.component.html",
    styleUrls: ['./add-task.component.css'],
    moduleId: module.id,
})

export class AddTaskComponent {
    minDate: Date = new Date()
    maxDate: Date = new Date(2045, 4, 12)
    showButtons : boolean;
    hasImage : boolean; // for check task has image or not

    task_name : string;
    task_detail: string;
    task_photo: Array<string> = [];
    date : Date;
    time : Date;
    task_notify: boolean;
    tags : Array<string> = []

    imagePath: string | undefined;

    public constructor(private taskService: TaskService,public datepipe: DatePipe, public location: Location, public router: Router) {
        this.date = new Date();
        this.time = new Date();
        this.showButtons = false;
        this.hasImage = false;
        this.task_photo = []
        this.task_notify = true
    }

    public add() {
        let overdue : boolean
        let now = new Date()
        let datetime = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(),
            this.time.getHours(),this.time.getMinutes())
        datetime < now ? overdue=true : overdue=false // check datetime is overdue or not
        this.taskService.addTask(this.task_name, this.task_detail, datetime, this.task_photo, 
            this.task_notify, overdue, this.tags)
        this.location.back()
    }
 
    public toggleVisible(){
        this.showButtons = !this.showButtons;
    }

    public tagsToggle(args: EventData){
        const button = args.object as Button
        let tag_exist = this.tags.find(tag => tag == button.text)

        if(tag_exist){
            this.tags.splice(this.tags.indexOf(tag_exist), 1) // remove tag selected
            button.backgroundColor = '#F2F2F7'
            button.color = new Color('#1d62cf')
            button.borderColor = '#1d62cf'
        }
        else {
            this.tags.push(button.text) // add tag selected
            button.backgroundColor = '#1d62cf'
            button.color = new Color('#F2F2F7')
            button.borderColor = '#F2F2F7'
        }
    }

    public deletePhoto(path: string){
        for(let i = 0; i < this.task_photo.length; i++) {
            if(this.task_photo[i] == path) {
              this.task_photo.splice(i, 1);
              break;
            }
        }
    }

    getRandomString() {
        // random hash generator for generate file name
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < 16; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    takePhoto(): void {
        if (!camera.isAvailable()) {
            throw new Error('Camera not available');
        }
        from(camera.requestPermissions()).pipe(
            flatMap(() => camera.takePicture()),
            flatMap((imageAsset: ImageAsset) => ImageSource.fromAsset(imageAsset)),
            map((imageSource: ImageSource) => {
                // set photo name and path
                const fileName = this.getRandomString() + ".jpg";
                const photoFilePath = this.createPhotoPath(fileName);

                // save photo in full quality to file
                const success: boolean = imageSource.saveToFile(photoFilePath, 'jpg');
                if (!success) {
                    throw new Error('Error during saving photo image to file ' + photoFilePath);
                }
                return photoFilePath;
            })
        ).subscribe(photoFilePath => {
            this.task_photo.push(photoFilePath)
            this.hasImage = true; // set image visible
        }, error => {
            console.log(error);
        })
    }

    public pickPhoto() {
        let that = this;
        let context = imagepicker.create({
            mode: "multiple"
        });
        
        context
            .authorize()
            .then(function() {
                return context.present();
            })
            .then(function(selection) {
                selection.forEach(function(selected) {
                    // process the selected image
                    let source = ImageSource.fromAsset(selected)
                    source.then((imageSource: ImageSource) => {
                        // set photo name and path & save it
                        let fileName = that.getRandomString() + ".jpg";
                        const photoFilePath = that.createPhotoPath(fileName);
                        const success: boolean = imageSource.saveToFile(photoFilePath, 'jpg');

                        if (!success) {
                            throw new Error('Error during saving photo image to file ' + photoFilePath);
                        }
                        else {
                            // save successfully
                            that.imagePath = photoFilePath;
                            that.task_photo.push(that.imagePath)
                            that.hasImage = true; // set image visible
                        }
                        return photoFilePath;
                    })
                })
            }).catch(function (e) {
                console.log(e);
            });
    }

    private createPhotoPath(fileName: string): string {
        const documentFolders = knownFolders.documents();
        if (!documentFolders) {
            throw new Error('Documents folder is not available');
        }

        // gets or creates photo folder
        let photoFolderPath;
        photoFolderPath = documentFolders.getFolder('images');

        // gets or creates empty file
        const photoFile = photoFolderPath.getFile(fileName);
        if (!photoFile) {
            throw new Error('Cannot create photo file');
        }
        return photoFile.path;
    }

    public photoViewer(src: string){
        this.router.navigate(['/photo', src ]);
    }
}