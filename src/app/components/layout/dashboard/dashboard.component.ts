import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { authService } from '@S/auth.service';
import { localStorageService } from '@S/localStorage.service';
import { statusBarService } from '@S/statusBar.service';
import { BreakpointObserver } from '@angular/cdk/layout';
// import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { KeyboardShortcutsHelpComponent, ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(KeyboardShortcutsHelpComponent)
    public keyboardHelp!: KeyboardShortcutsHelpComponent;
    shortcuts: ShortcutInput[] = [];
    @ViewChild('drawer', { static: true })
    input!: MatDrawer;
    @ViewChild('drawer', { static: true })
    drawer!: MatDrawer;
    user: any;
    intervalId!: NodeJS.Timer;
    timer!: string;
    parsedToken: any;
    backDropFlag!: boolean;

    constructor(private router: Router, private auth: authService, public statusBar: statusBarService, public dialog: MatDialog, private observer: BreakpointObserver, private cdr: ChangeDetectorRef) {
        // this.user = auth.user;
        // this.parsedToken = this.auth.parsedJwt;
        // localStorageService.set('sidebar_drawer', 'open');
    }

    ngOnInit(): void {
        this.intervalId = setInterval(() => {
            this.timer = new Date().toString();
        }, 1000);
        this.shortcuts.push(
            {
                key: ['cmd + b'],
                label: 'Hotkey',
                description: 'Toggle Sidebar',
                command: (e) => {
                    this.input.toggle();
                    this.togglePrevState();
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + h'],
                label: 'Hotkey',
                description: 'Go To: Dashboard',
                command: (e) => {
                    this.router.navigate(['home']);
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + e'],
                label: 'Hotkey',
                description: 'Go To: Budget Release',
                command: (e) => {
                    this.router.navigate(['wbBudgetEntry']);
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + m'],
                label: 'Hotkey',
                description: 'Go To: Budget Release Modify',
                command: (e) => {
                    this.router.navigate(['wbBudgetModify']);
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + a'],
                label: 'Hotkey',
                description: 'Go To: Budget Release Approve',
                command: (e) => {
                    this.router.navigate(['wbBudgetApprove']);
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + s'],
                label: 'Hotkey',
                description: 'Go To: Sanction Letter Management Entry',
                command: (e) => {
                    this.router.navigate(['wbBudgetSanctionLetterMngmt']);
                },
                preventDefault: true,
            },
            {
                key: ['cmd + shift + d'],
                label: 'Hotkey',
                description: 'Toggle Dark Mode',
                command: (e) => {
                    this.toggleDarkMode();
                },
                preventDefault: true,
            }
        );
    }

    ngAfterViewInit() {
        this.observer.observe(['(max-width: 1280px)']).subscribe((res) => {
            if (res.matches) {
                this.drawer.mode = 'over';
                this.backDropFlag = true;
            } else {
                this.drawer.mode = 'side';
                this.backDropFlag = false;
            }
        });
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
    }

    get prevSate(): boolean {
        return localStorageService.get('sidebar_drawer') == 'open';
    }

    togglePrevState() {
        var openF: boolean = this.prevSate;
        localStorageService.set('sidebar_drawer', !openF ? 'open' : 'close');
    }

    toggleDarkMode() {
        var darkThm: boolean = localStorageService.get('th') == 'dark';
        document.body.classList.toggle('darkMode');
        localStorageService.set('th', !darkThm ? 'dark' : 'normal');
    }

    logout() {
        this.auth.logout();
    }

    onLoadComponent(event: any) {
        this.statusBar.text = '';
    }

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(CommonDialogComponent, {
            width: '250px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: {
                mode: 'Master Configuaration',
            },
        });
    }
}
