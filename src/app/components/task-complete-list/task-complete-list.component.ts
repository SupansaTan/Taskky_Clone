import { Component, OnInit } from "@angular/core";

@Component ({
    selector: "task-complete-list",
    templateUrl: "./task-complete-list.component.html",
    styleUrls: ['./task-complete-list.component.css'],
    inputs: ['date']
})

export class TaskCompleteListComponent {
    tasks = []

    public constructor() {
        
    }

    ngOninit(){

    }

    public set date(value: Date){
        
    }

}