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
    complete_tasks: Array<any> = []
    task_checked: Array<any> = []
    private updateSubscription: Subscription;

    public constructor(private datepipe : DatePipe, private taskService: TaskService) {
        this.complete_tasks = this.taskService.getCompleteTasks()
        this.complete_tasks.map(complete_task => {
            complete_task.hide_task = true // hide all task name of each date
            complete_task.tasks.map(item => {
                item.isChecked = false // unchecked box all tasks
            })
        }) 
    }

    ngOnInit(){
        // auto refresh every one second
        this.updateSubscription = interval(1000).subscribe(
            (val) => { 
                this.complete_tasks = this.taskService.getCompleteTasks()
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
        let task = this.complete_tasks.find(task => task.date == date)
        task.hide_task = !task.hide_task
    }

    public checkbox_toggle(isChecked: boolean, task_name: string, task_datetime: Date){

        if(!isChecked){
            // checked box
            if(!this.task_checked.find(item => item.name==task_name && item.date==task_datetime)){
                // when task info not exist in array => increase task info
                this.task_checked.push(
                    {
                        name: task_name,
                        date: task_datetime
                    }
                )
            }
        }
        else{
            // unchecked box
            this.unchecked(task_name, task_datetime)
        }

    }

    public unchecked(name: string, datetime: Date){
        for(let i = 0; i < this.task_checked.length; i++) {
            if(this.task_checked[i].name==name && this.task_checked[i].date == datetime) {
              this.task_checked.splice(i, 1); // remove task info in task_checked array
              break;
            }
        }
    }

    public deleteTask(){
        /* delete each task in completed tasks */
        this.task_checked.forEach(task => {
            for(let i = 0; i < this.complete_tasks.length; i++) {
                for(let j = 0; j < this.complete_tasks[i].tasks.length; j++) {
                    let get_due_date = new Date(Date.parse(this.complete_tasks[i].tasks[j].due_date))
                    let task_checked_date = new Date(Date.parse(task.date))

                    /* date and task name as same */
                    if((this.complete_tasks[i].date.getDate() == get_due_date.getDate())
                     && (this.complete_tasks[i].tasks[j].name == task.name) &&
                     (get_due_date.getTime() == task_checked_date.getTime())) {
                        
                        if(this.complete_tasks[i].tasks.length <= 1){ // the last task in that date
                            this.taskService.deleteCompleteTask(i) // delete both of that date and task
                            break;
                        }
                        else{
                            this.taskService.deleteCompleteTask(i,j) // delete the task
                            break;
                        }
                    }
                }
            }
        })

        /* clear array */
        this.task_checked = []
    }
}