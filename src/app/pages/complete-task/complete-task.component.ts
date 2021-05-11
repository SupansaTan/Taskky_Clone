import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Button, EventData } from "@nativescript/core";
import { Subscription, interval } from "rxjs";

import { Task } from "~/app/task";
import { TaskService } from "~/app/task.service";

@Component ({
    selector: "complete-task",
    templateUrl: "./complete-task.component.html",
    styleUrls: ['./complete-task.component.css'],
})

export class CompleteTaskComponent implements OnInit {
    tasks: Array<any> = []
    tasks_seperate_date: Array<any> = []
    toggleButton: boolean
    private updateSubscription: Subscription;

    public constructor(private datepipe : DatePipe, private taskService: TaskService) {
        this.tasks = this.taskService.getTasks().filter(task => task.complete==true)
        this.separate_date()
        this.toggleButton = false // arrow down : hide tasks
    }

    ngOnInit(){
        // auto refresh every one second
        this.updateSubscription = interval(1000).subscribe(
            (val) => { 
                this.tasks = this.taskService.getTasks().filter(task => task.complete == true);
                this.separate_date()
            }
        );
    }

    private separate_date(){
        this.tasks.forEach((task) => {
            let task_date = this.datepipe.transform(task.due_date, 'dd/MM/yyyy')
            let date_exist = this.tasks_seperate_date.find(item => 
                this.datepipe.transform(item.date, 'dd/MM/yyyy') == task_date)
            let task_exist = this.tasks_seperate_date.find(item => 
                item.date==task.due_date && item.tasks.find(t => t.id == task.id)
            )

            if (date_exist && !task_exist){
                // date exist in list
                date_exist.tasks.push(task)
            }
            else{
                this.tasks_seperate_date.push(
                    {
                        date: task.due_date, 
                        tasks: [task]
                    }
                )
            }
        })
    }

    public arrowToggle(){
        this.toggleButton = !this.toggleButton
    }
}