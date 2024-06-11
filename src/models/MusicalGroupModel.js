class GroupModel {
    constructor(name, admin) {
      this.name = name;
      this.admin = admin;
      this.creationDate = new Date().toLocaleString();
    }
    
  }
  
  export default GroupModel;
