import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, appDeclaration } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { SecondBarComponent } from './components/common/second-bar/second-bar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { netlogInterceptor } from '$/interceptors/networkLog.interceptor';
import { networkErrorInterceptor } from '$/interceptors/networkError.interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CacheInterceptor } from '$/interceptors/cache.interceptor';
import { netSpinnerInterceptor } from '$/interceptors/networkSpinner.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { JwtInterceptor } from '$/interceptors/jwt.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { CustomMatErrorComponent } from './helper/custom-mat-error/custom-mat-error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
    declarations: [AppComponent, appDeclaration, SecondBarComponent, CustomMatErrorComponent,],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatIconModule,
        MatGridListModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatButtonModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        FormsModule,
        MatMenuModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatExpansionModule,
        MatCardModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        NgxSpinnerModule,
        KeyboardShortcutsModule.forRoot(),
        MatTooltipModule,
        MatBadgeModule,
        MatChipsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressBarModule,
        ToastrModule.forRoot(),
    ],
    providers: [
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: netlogInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: networkErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: netSpinnerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
