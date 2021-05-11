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

    public convertDate(date: Date){
        let now = new Date()
        let yesterday = new Date()
        let tomorrow = new Date()
        yesterday.setDate(now.getDate()-1)
        tomorrow.setDate(now.getDate()+1)

        // change date format
        let date_now = this.datepipe.transform(now, 'dd/MM/yyyy')
        let date_yesterday = this.datepipe.transform(yesterday, 'dd/MM/yyyy')
        let date_tomorrow = this.datepipe.transform(tomorrow, 'dd/MM/yyyy')
        let due_date = this.datepipe.transform(date, 'dd/MM/yyyy')

        return date_now == due_date ? 'Today' :
            due_date == date_yesterday ? 'Yesterday' :
            due_date == date_tomorrow ? 'Tomorrow' :
            due_date
    }

    public arrowToggle(date: Date){
        let task = this.tasks.find(task => task.date == date)
        task.hide_task = !task.hide_task
    }
}