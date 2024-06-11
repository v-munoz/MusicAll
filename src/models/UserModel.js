class UserModel {
    constructor(email, name, surname, birthDate, selectedInstruments) {
      this.email = email;
      this.name = name;
      this.surname = surname;
      this.birthDate = birthDate;
      this.instruments = selectedInstruments;
      this.creationDate = new Date().toLocaleString();
    }
    
  }
  
  export default UserModel;
  