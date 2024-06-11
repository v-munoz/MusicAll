class AccountModel {
  constructor(email, name, surname, birthDate, selectedInstruments) {
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.birthDate = birthDate;
    this.selectedInstruments = selectedInstruments;
    this.creationDate = new Date().toLocaleString();
  }
  
}

export default AccountModel;
