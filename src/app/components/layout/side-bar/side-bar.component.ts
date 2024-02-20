import { authService } from '@S/auth.service';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'sideBar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
    authorityCode!: string;
    userLevel: number;
    constructor(private router: Router, private renderer: Renderer2, private el: ElementRef, private authService: authService) {
        this.userLevel = +this.authService.user.Levels[0].Scope[0].substring(2, 4);
    }

    ngOnInit(): void {
        this.authorityCode = this.authService.user.Levels[0].Scope[0];
    }

    goToEntry(e: Event) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/wbBudgetEntry']);
        });
        // window.location.reload();
    }
}
