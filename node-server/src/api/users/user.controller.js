import UserService from "./user.service.js";

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req, res) => {
    const user = await this.userService.createUser(req.body);
    res.json(user);
  };

  getUser = async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    res.json(user);
  };

  updateUser = async (req, res) => {
    const user = await this.userService.updateUser(req.params.id, req.body);
    res.json(user);
  };

  deleteUser = async (req, res) => {
    const user = await this.userService.deleteUser(req.params.id);
    res.json(user);
  };

  addVipCard = async (req, res) => {
    const user = await this.userService.addVipCard(req.params.id, req.body);
    res.json(user);
  };

  addPurchaseToHistory = async (req, res) => {
    const user = await this.userService.addPurchaseToHistory(req.params.id, req.body);
    res.json(user);
  };

}