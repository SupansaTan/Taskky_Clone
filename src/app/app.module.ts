import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptFormsModule } from "@nativescript/angular";
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";
import { registerElement } from '@nativescript/angular';
import { CardView } from '@nstudio/nativescript-cardview';
import { NativeScriptMaterialBottomSheetModule } from "@nativescript-community/ui-material-bottomsheet/angular";
registerElement('CardView', () => CardView);
registerElement('ImageZoom', () => require('@happones/nativescript-image-zoom').ImageZoom);

import { HomeComponent } from './pages/home/home.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { TaskListComponent } from './components/task-list/task-list.component'
import { TaskDetailComponent } from './pages/task-detail/task-detail.component'
import { AddTaskComponent } from './pages/add-task/add-task.component'
import { EditTaskComponent } from './pages/edit-task/edit-task.component'
import { PhotoViewerComponent } from './pages/photo-viewer/photo-viewer.component'
import { AboutUsComponent } from './pages/about-us/about-us.component'
import { CompleteTaskComponent } from './pages/complete-task/complete-task.component'
import { TaskCompleteListComponent } from './components/task-complete-list/task-complete-list.component'

import { TaskService } from './task.service'
import { DatePipe } from '@angular/common'


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule, 
    NativeScriptFormsModule, 
    NativeScriptDateTimePickerModule,
    NativeScriptMaterialBottomSheetModule,
  ],
  declarations: [
    AppComponent, 
    HomeComponent, 
    TopBarComponent, 
    TaskListComponent, 
    AddTaskComponent,
    TaskDetailComponent,
    EditTaskComponent,
    PhotoViewerComponent,
    AboutUsComponent,
    CompleteTaskComponent,
    TaskCompleteListComponent,
  ],
  providers: [TaskService, DatePipe],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
