export const NumberPattern = '^[0-9]*';

export const DemandPattern = '^[0-9.NA]*';

export const StringPattern = '^[a-zA-Z ]*';

export const PasswordPattern = '^(?=.*[0-9A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*#?&])([a-zA-Z0-9!@#$%^&*]{8,15})$';

export const AddressPattern = '^[ A-Za-z0-9.,#-/()]*$';

export const Email = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

export const AlphaNumeric = '^[a-zA-Z0-9]*$';

export const AlphaNumericWithSlash = '^[a-zA-Z0-9/]*$';

export const panPattren = '^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$';

// tslint:disable-next-line:quotemark
export const fullNamePattern = '[a-zA-Z]+(([. ][a-zA-Z ])?[a-zA-Z]*)*$';

export const CapacityRatingPattern = '^[0-9./]*$';

export const inputStringNumPattern = '^[^\\s][ A-Za-z0-9-._/()]*';

export const mobileNumberPattern = '^[0][1-9]d{9}$|^[1-9]d{9}$';

export const NegativeNumberPattern = '^[0-9.-]*';

export const NumberPatternwithoutPoint = '^[0-9]*';

export const NumberPatternPoint = '^[0-9.]*';

export const inputStringWithoutSpace = '^[A-Za-z]*$';

export const AlphaWithSlash = '^[^\\s][ A-Za-z-._/()]*';

export const telephonNumberPattern = '^([+0-9]){3}([0-9]){11}?$';

export const payeeNamePattern = '^[a-zA-Z0-9. ]*$';

export const noSpecialCharacter = '/^[a-zA-Z0-9s]*$/';

export const ValidationObj = {
    NumberPattern: { pattern: '^[0-9]*', errorMsg: 'Value must be a whole number.' },
    amount: { pattern: '^[0-9]*$', errorMsg: 'Amount must be a whole number.' },
    Email: { pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$', errorMsg: 'Must be a valid email.' },
};
