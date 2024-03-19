const User = require("../models/userModel");
const Group = require("../models/groupModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


module.exports.login = async (req, res, next) => {
  try {
  const { username, password , /*token*/} = req.body;
    /*
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );
    if (response.data.success) {
      res.send("Human 👨 👩");
    } else {
      res.send("Robot 🤖");
    }*/

    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Nom d'utilisateur ou mot de passe incorrect", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Nom d'utilisateur ou mot de passe incorrect", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, surname, password, publicKey } = req.body;
    const usernameCheck = await User.findOne({ username });
    const keyCheck = await User.findOne({ publicKey });
    if (usernameCheck)
      return res.json({ msg: "Ce nom d'utilisateur est déjà utilisé", status: false });
    if (keyCheck)
      return res.json({ msg: "Veuillez réessayer", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      surname,
      password: hashedPassword,
      publicKey,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "surname",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "L'ID de l'utilisateur est requis " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.createGroup = async (req, res, next) => {
  try {
    const { name, admin, members } = req.body;
    members.push(admin);
    console.log(members);
    const group = await Group.create({ name: name, admin: admin, members });
    return res.json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getGroupMembers = async (req, res, next) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.json({ msg: "Groupe non trouvé", status: false });
    const members = group.members.filter(member => member !== userId);
    return res.json({ status: true, members });
  } catch (ex) {
    next(ex);
  }
};

/*
module.exports.addMemberToGroup = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.json({ msg: "Groupe non trouvé", status: false });
    group.members.push(memberId);
    await group.save();
    return res.json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};

module.exports.removeMemberFromGroup = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.json({ msg: "Groupe non trouvé", status: false });
    const index = group.members.indexOf(memberId);
    if (index === -1) return res.json({ msg: "Membre non trouvé dans le groupe", status: false });
    group.members.splice(index, 1);
    await group.save();
    return res.json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};*/

module.exports.getAllGroups = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const groups = await Group.find({ members: userId }).select([
      "name",
      "members",
    ]);
    return res.json({ status: true, groups });
  } catch (ex) {
    next(ex);
  }
};
