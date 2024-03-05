import { AbstractControlOptions, FormBuilder, FormGroup, ɵElement } from '@angular/forms';

declare module '@angular/forms' {
    export interface FormBuilder {
        PowerForm<T extends {}>(controls: T, options?: AbstractControlOptions | null): FormGroup<{
            [K in keyof T]: ɵElement<T[K], null>;
        }>;
    }
}

FormBuilder.prototype.PowerForm = function <T extends {}>(controls: T, options?: AbstractControlOptions | null): FormGroup<{
    [K in keyof T]: ɵElement<T[K], null>;
}> {
    return this.group(controls, options);
}
