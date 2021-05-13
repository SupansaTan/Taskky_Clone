import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import * as AppSettings from '@nativescript/core/application-settings'
import { LocalNotifications } from '@nativescript/local-notifications';
import { Task } from './task'
import { isNumber } from '@nativescript/core/utils/types';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: Array<any>;
    private tasks_complete : Array<any>

    public constructor(private datepipe : DatePipe) { 
        const openFirstTime = AppSettings.getBoolean("FistTime");

        /* check using app first time or not */
        if(openFirstTime == null || openFirstTime == undefined){
            this.tasks = []
            this.tasks_complete = []
            AppSettings.setString("TaskData", JSON.stringify(this.tasks)); // store tasks data
            AppSettings.setString("TaskCompleteData", JSON.stringify(this.tasks_complete)); // store tasks complete data
            AppSettings.setBoolean("FistTime", false);
        }
        else {
            this.tasks = JSON.parse(AppSettings.getString("TaskData")); // get task data that store in app settings
            this.tasks_complete = JSON.parse(AppSettings.getString("TaskCompleteData")); // get tasks complete data that store in app settings
            
            /* convert from string to Date type */
            this.tasks.forEach((task) => {task.due_date = new Date(Date.parse(task.due_date))})
            
            if (this.tasks_complete.length > 0){
                this.tasks_complete.forEach((complete_task) => {
                    complete_task.date = new Date(Date.parse(complete_task.date))
                    complete_task.tasks.date = new Date(Date.parse(complete_task.tasks.date))
                })
            }
        }
    }

    public setOverdue(id: number, overdue: boolean){
        this.tasks.find(task => task.id == id).overdue = overdue
    }

    public checklist(id: number){
        this.addCompleteTask(this.tasks.filter(x => x.id == id)[0])
        this.deleteTask(id)
    }

    public getTasks(): Array<any> {
        return this.tasks;
    }

    public getCompleteTasks(): Array<any> {
        return this.tasks_complete
    }

    public getTask(id: number){
        return this.tasks.filter(x => x.id == id)[0];
    }

    public getCompleteTask(date: Date): Array<any> {
        return this.tasks_complete.filter(task => task.date == date)[0]
    }

    public addTask(name: string, detail:string, datetime:Date, photoPath:Array<string>, 
        notify:boolean, overdue:boolean){
        let last_id: number;
        
        /* get id */
        this.tasks.length > 0 ? last_id=this.tasks[this.tasks.length-1].id : last_id=0
        this.tasks.push(
            {
              'id': last_id+1,
              'name': name == undefined ? name='':name,
              'detail': detail,
              'due_date': datetime,
              'photo': photoPath,
              'notify': notify,
              'overdue': overdue,
            }
        );
        this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks));

        if(notify){
            this.setNotify(last_id+1, name, datetime)
        }
    }

    public addCompleteTask(task){
        let date_exist = this.tasks_complete.find(item => 
            item.date.getDate() == task.due_date.getDate())

        if (date_exist){
            // date exist in list
            date_exist.tasks.push(task)
        }
        else{
            this.tasks_complete.push(
                {
                    date: task.due_date, 
                    tasks: [task],
                    hide_task: true
                }
            )
            
            this.tasks_complete.map(complete_task => {
                complete_task.tasks.map(item => {
                    item.isChecked = false // unchecked box all tasks
                })
            }) 
            this.tasks_complete.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0) // sort tasks by due date
        }
        AppSettings.setString("TaskCompleteData", JSON.stringify(this.tasks_complete));
    }

    public editTask(id:number, name: string, detail:string, datetime:Date, photoPath:Array<string>, 
        notify:boolean, overdue:boolean){
        this.tasks[id] = {
            'id': id,
            'name': name,
            'detail': detail,
            'due_date': datetime,
            'photo': photoPath,
            'notify': notify,
            'overdue': overdue,
        }
        this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks));

        /* set notify */
        let now = new Date()
        if(notify && datetime > now){
            this.setNotify(id, name, datetime)
        }
    }

    public deleteTask(id:number){
        for(let i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].id == id) {
              this.tasks.splice(i, 1);
              this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
              break;
            }
        }
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks))
    }

    public deleteCompleteTask(date_id: number): void;
    public deleteCompleteTask(date_id: number, task_id: number): void;
    public deleteCompleteTask(date_id: number, task_id?: number): void {
        if(isNumber(task_id)){
            this.tasks_complete[date_id].tasks.splice(task_id, 1)
        }
        else{
            this.tasks_complete.splice(date_id, 1);
            this.tasks_complete.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0) // sort tasks by due date
        }
        AppSettings.setString("TaskCompleteData", JSON.stringify(this.tasks_complete));
    }

    private setNotify(id:number, name:string, datetime:Date){
        let date_notify = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()-1,
        datetime.getHours(), datetime.getMinutes())

        LocalNotifications.schedule([
            {
                id: id,
                title: 'Task Reminder',
                body: "ครบกำหนดพรุ่งนี้: " + name,
                badge: 1,
                icon: 'res//logo',
                at: date_notify,
                forceShowWhenInForeground: true,
            },
        ])
    }
}