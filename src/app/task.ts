export interface Task {
    id: number;
    name: string;
    due_date: Date;
    photo: Array<String>;
    notify: boolean;
    overdue: boolean;
    complete: boolean;
}