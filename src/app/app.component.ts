import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { ShortcutInput, ShortcutEventOutput } from 'ng-keyboard-shortcuts';
import { localStorageService } from '@S/index';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    shortcuts: ShortcutInput[] = [];
    title = 'eB-FE';
    constructor() {
        if (localStorageService.get('th') == 'dark') document.body.classList.toggle('darkMode');
    }
    ngOnInit(): void {
        this.shortcuts.push({
            key: ['a r k enter'],
            label: 'Sequences Codes',
            description: 'ARK code!',
            command: (output: ShortcutEventOutput) => alert('Welcome Arijit'),
        });
    }
}
