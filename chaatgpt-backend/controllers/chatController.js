const Chat = require("../models/chatModel");

exports.getChats = async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
};

exports.getChat = async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.json(chat);
};

exports.createChat = async (req, res) => {
  const chat = new Chat({ title: "New Chat", messages: [] });
  await chat.save();
  res.status(201).json(chat);
};

exports.updateChat = async (req, res) => {
  const { messages } = req.body;
  let title = messages[0]?.content?.slice(0, 30) || "Untitled";

  const updatedChat = await Chat.findByIdAndUpdate(
    req.params.id,
    { messages, title },
    { new: true }
  );
  res.json(updatedChat);
};

exports.deleteChat = async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ message: "Chat deleted" });
};
