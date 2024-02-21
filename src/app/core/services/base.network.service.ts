import { environment } from "@E/environment";
import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";
import { authService } from "./auth.service";
import { NotificationService } from "./notification.service";
import { ToastrService } from "ngx-toastr";
import { statusBarService } from "./statusBar.service";

export abstract class baseNetworkService {
    http: HttpClient;
    auth: authService;
    notifyIt: NotificationService;
    toastr: ToastrService;
    statusBar: statusBarService;
    constructor(injector: Injector) {
        this.http = injector.get(HttpClient);
        this.auth = injector.get(authService);
        this.notifyIt = injector.get(NotificationService);
        this.toastr = injector.get(ToastrService);
        this.statusBar = injector.get(statusBarService);
    }
    abstract get version(): string;
    get backend(): string {
        return `${environment.backend}/api/${this.version}`;
    }
}
