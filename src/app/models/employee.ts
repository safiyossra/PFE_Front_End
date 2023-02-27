export class Employee{
  employeeId: any
  lastName: any
  firstName: any
  address: any
  city: any
  tel: any
  email: any
  fonction: any
  login: any

  constructor(employeeId?,lastName?, firstName?, address?, city?, tel?, email?, fonction?, login?) {
    this.employeeId=employeeId?? ''
    this.lastName=lastName?? ''
    this.firstName=firstName?? ''
    this.address=address?? ''
    this.city=city?? ''
    this.tel=tel?? ''
    this.email=email?? ''
    this.fonction=fonction?? ''
    this.login=login?? ''
  }
}
