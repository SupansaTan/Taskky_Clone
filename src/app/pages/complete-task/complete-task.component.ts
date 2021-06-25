import { DatePipe } from "@angular/common";
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Subscription, interval } from "rxjs";

import { TaskService } from "~/app/task.service";

@Component ({
    selector: "complete-task",
    templateUrl: "./complete-task.component.html",
    styleUrls: ['./complete-task.component.css'],
})

export class CompleteTaskComponent implements AfterViewChecked {
    complete_tasks: Array<any> = []
    task_checked: Array<any> = []
    private updateSubscription: Subscription;

    public constructor(private datepipe : DatePipe, private taskService: TaskService, 
        private cdRef: ChangeDetectorRef ) {
        this.complete_tasks = this.taskService.getCompleteTasks()
        this.complete_tasks.map(complete_task => {
            complete_task.hide_task = true // hide all task name of each date
            complete_task.tasks.map(item => {
                item.isChecked = false // unchecked box all tasks
            })
        }) 
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges()
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

    public checkboxToggle(isChecked: boolean, task_name: string, task_datetime: string){
        let datetime = new Date(Date.parse(task_datetime))
        //console.log(isChecked)
        if(!isChecked){
            // checked box
            if(!this.task_checked.find(task => task.name==task_name && task.date.getDate()==datetime.getDate())){
                // when task info not exist in array => increase task info
                this.task_checked.push(
                    {
                        name: task_name,
                        date: datetime
                    }
                )
            }
        }
        else{
            // unchecked box
            this.unchecked(task_name, datetime)
        }

        /*
        //update isChecked value
        let complete_task = this.complete_tasks.find(complete_task => complete_task.date.getDate() == datetime.getDate())
        complete_task.tasks.forEach(task => {

            if(task.name == task_name){
                task.isChecked = !task.isChecked
            }
        })
        */
    }

    public unchecked(name: string, datetime: Date){
        for(let i = 0; i < this.task_checked.length; i++) {
            if(this.task_checked[i].name==name && this.task_checked[i].date.getDate() == datetime.getDate()) {
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
                    let task_due_date = new Date(Date.parse(this.complete_tasks[i].tasks[j].due_date))
                    let task_checked_date = new Date(Date.parse(task.date))

                    /* date and task name as same */
                    if((this.complete_tasks[i].date.getDate() == task_due_date.getDate())
                     && (this.complete_tasks[i].tasks[j].name == task.name) &&
                     (task_due_date.getTime() == task_checked_date.getTime())) {
                        
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

    public restoreTask(){
        /*
        for(let i = 0; i < this.complete_tasks.length; i++){
            for(let j = 0; j < this.complete_tasks[i].tasks.length; j++){
                
                let current_task = this.complete_tasks[i].tasks[j]
                let due_date = new Date(Date.parse(current_task.due_date))

                this.task_checked.forEach(t => {

                    if(t.name == current_task.name && t.date.getDate() == due_date.getDate()){
                        
                        this.taskService.addTask(current_task.name, current_task.detail, 
                            due_date, current_task.photo, current_task.notify, 
                            current_task.overdue, current_task.tags)
                        
                        if(this.complete_tasks[i].tasks.length <= 1){ // the last task in that date
                            this.taskService.deleteCompleteTask(i) // delete both of that date and task
                        }
                        else{
                            this.taskService.deleteCompleteTask(i,j) // delete the task
                        }
                        this.task_checked.shift()
                    }
                })
            }
        }
        */
        this.task_checked.forEach(task => {
            for(let i = 0; i < this.complete_tasks.length; i++) {
                for(let j = 0; j < this.complete_tasks[i].tasks.length; j++) {
                    let task_due_date = new Date(Date.parse(this.complete_tasks[i].tasks[j].due_date))
                    let task_checked_date = new Date(Date.parse(task.date))

                    /* date and task name as same */
                    if((this.complete_tasks[i].date.getDate() == task_due_date.getDate())
                     && (this.complete_tasks[i].tasks[j].name == task.name) &&
                     (task_due_date.getTime() == task_checked_date.getTime())) {

                        let current_task = this.complete_tasks[i].tasks[j]
                        this.taskService.addTask(current_task.name, current_task.detail, 
                            task_due_date, current_task.photo, current_task.notify, 
                            current_task.overdue, current_task.tags)
                        
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