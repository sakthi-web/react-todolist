const { v4: uuidv4 } = require("uuid");

let taskList = [
];

exports.getTasks = (req, res) => {
  res.status(200).json({ status: "success", data: taskList });
};

exports.updateTask = (req, res) => {
  let id = req.params.id;
  let task = taskList.find((t) => t.id === id);
  if (task) {
    task.completed = req.body.completed;
    task.isActive = req.body.isActive;
    res.status(200).json({ status: "success", data: taskList });
  } else {
    res.status(404).json({ status: "error", message: "Task not found" });
  }
};

exports.addTask = (req, res) => {
  let task = {
    taskName: req.body.taskName,
    completed: req.body.completed,
    isActive: req.body.isActive,
    id: uuidv4(),
  };
  taskList.push(task);
  res.status(200).json({ status: "success", data: taskList });
};

exports.deleteTask = (req, res) => {
  let id = req.params.id;
  taskList = taskList.filter((t) => t.id !== id);
  res.status(200).json({ status: "success", message: "Task deleted", data: taskList });
};

exports.deleteAllCheckedTask = (req, res) => {
  taskList = taskList.filter((t) => t.completed === false);
  res.status(200).json({ status: "success", message: "All Checked Item is Deleted", data: taskList });
};

exports.deleteAllActiveTask = (req, res) => {
  taskList = taskList.filter((t) => t.isActive === true);
  res.status(200).json({ status: "success", message: "All Active Item is Deleted", data: taskList });
};
