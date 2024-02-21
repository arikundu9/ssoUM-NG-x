import { environment } from "@E/environment";

export abstract class baseNetworkService {
    abstract get version(): string;
    get backend(): string {
        return `${environment.backend}/api/${this.version}`;
    }
}
