//This passowrd custom validator for cross field validation
import { AbstractControl } from "@angular/forms";

export function passwordValidator(control:AbstractControl):{[key:string]:boolean} | null {
  var password = control.get('password');
  var passwordAgain = control.get('passwordAgain');

  return password && passwordAgain && password.value != passwordAgain.value ? {'misMatch':true} : null;

}
