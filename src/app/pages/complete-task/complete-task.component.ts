import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Button, EventData } from "@nativescript/core";

@Component ({
    selector: "complete-task",
    templateUrl: "./complete-task.component.html",
    styleUrls: ['./complete-task.component.css'],
})

export class CompleteTaskComponent {
    tasks = []


    public constructor(private datepipe : DatePipe) {
        let now = new Date()
        this.tasks = [
            {name:'Today', count:4}, 
            {name:'Yesterday', count:1}, 
            {name:this.datepipe.transform(now, 'dd/MM/yyyy'), count:7}
        ]
    }

    ngOninit(){

    }

    public arrowToggle(args: EventData){
        let button = args.object as Button
        button.text=='&#xf078;' ? button.text='&#xf077;': button.text='&#xf078;'
    }
}