
export class UserListDTO {
    constructor({ _id, name, email, role }) {
      this.id = _id;
      this.name = name;
      this.email = email;
      this.roleType = role.type;
    }
  }
  
  export class UserDetailDTO {
    constructor({ _id, name, email, role, vip_card, purchase_history }) {
      this.id = _id;
      this.name = name;
      this.email = email;
      this.role = new RoleDTO(role);
      this.vipCard = vip_card ? new VipCardDTO(vip_card) : null;
      this.purchaseHistory = purchase_history.map(p => new PurchaseHistoryDTO(p));
    }
  }
  
  export class RoleDTO {
    constructor({ type, assignment_date }) {
      this.type = type;
      this.assignmentDate = assignment_date;
    }
  }
  
  export class VipCardDTO {
    constructor({ card_number, expiration_date, issue_date }) {
      this.cardNumber = card_number;
      this.expirationDate = expiration_date;
      this.issueDate = issue_date;
    }
  }
  
  export class PurchaseHistoryDTO {
    constructor(purchaseId) {
      this.id = purchaseId;
    }
  }