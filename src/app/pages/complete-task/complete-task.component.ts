import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Subscription, interval } from "rxjs";

import { TaskService } from "~/app/task.service";

@Component ({
    selector: "complete-task",
    templateUrl: "./complete-task.component.html",
    styleUrls: ['./complete-task.component.css'],
})

export class CompleteTaskComponent implements OnInit {
    tasks: Array<any> = []
    task_checked: Array<any> = []
    private updateSubscription: Subscription;

    public constructor(private datepipe : DatePipe, private taskService: TaskService) {
        this.tasks = this.taskService.getCompleteTasks()
        this.tasks.map(task => {
            task.hide_task = true // hide all task name of each date
            task.tasks.map(item => item.isChecked = false) // unchecked box all tasks
        }) 
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

    public checkbox_toggle(isChecked: boolean, task_id: number, task_datetime: Date){
        let date = this.datepipe.transform(task_datetime, 'dd/MM/yyyy') // get only date

        if(!isChecked){
            // checked box
            this.task_checked.push(
                {
                    id: task_id,
                    date: task_datetime
                }
            )
        }
        else{
            // unchecked box
            this.unchecked(task_id)
        }
        
        /* change status isChecked */
        let task = this.tasks.find(item => this.datepipe.transform(item.date, 'dd/MM/yyyy') == date).tasks
        task.find(task => task.id == task_id).isChecked = !isChecked
    }

    public unchecked(id: number){
        for(let i = 0; i < this.task_checked.length; i++) {
            if(this.task_checked[i].id == id) {
              this.task_checked.splice(i, 1);
              break;
            }
        }
    }
}