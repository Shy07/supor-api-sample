/** Declaration file generated by dts-gen */

export = express_validation;

declare function express_validation(schema: any): any;

declare namespace express_validation {
    class ValidationError {
        constructor(errors: any, options: any);

        toJSON(): any;

        toString(): any;

    }

    function options(opts: any): void;

}

