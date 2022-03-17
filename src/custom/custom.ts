import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';

// Charts and BI
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
    imports:[
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        NgApexchartsModule,
        MatTableModule,
        MatChipsModule,
        CdkTableModule,
    ],
    exports:[
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        NgApexchartsModule,
        MatTableModule,
        MatChipsModule,
        CdkTableModule,
    ],
})
export class CustomMaterialModule{}