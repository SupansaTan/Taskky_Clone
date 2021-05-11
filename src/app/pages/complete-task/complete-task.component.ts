import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Button, EventData } from "@nativescript/core";
import { Subscription, interval } from "rxjs";

import { TaskService } from "~/app/task.service";

@Component ({
    selector: "complete-task",
    templateUrl: "./complete-task.component.html",
    styleUrls: ['./complete-task.component.css'],
})

export class CompleteTaskComponent implements OnInit {
    tasks: Array<any> = []
    private updateSubscription: Subscription;

    public constructor(private datepipe : DatePipe, private taskService: TaskService) {
        this.tasks = this.taskService.getCompleteTasks()
    }

    ngOnInit(){
        // auto refresh every one second
        this.updateSubscription = interval(1000).subscribe(
            (val) => { 
                this.tasks = this.taskService.getCompleteTasks()
            }
        );
    }

    public arrowToggle(date: Date){
        let task = this.tasks.find(task => task.date == date)
        task.hide_task = !task.hide_task
    }
}