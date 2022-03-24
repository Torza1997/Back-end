const axios = require("axios");
const express = require("express");
const router = express.Router();
const fs = require("fs");

const axiosInstance = axios.create({
  baseURL: `${process.env.ENDPOINT}`,
  headers: {
    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
    "Content-Type": "application/json",
  },
});
router.get("/user", (req, res) => {
  let UserJson = fs.readFileSync("./data/User.json");
  let UserOject = JSON.parse(UserJson);
  res.json(UserOject);
});
router.get("/user/:id", (req, res) => {
  let UserJson = fs.readFileSync("./data/User.json");
  let UserOject = JSON.parse(UserJson);
  let found = UserOject.some((user) => user.id === parseInt(req.params.id));
  if (found) {
    res.status(200).json(UserOject[req.params.id]);
  } else {
    res.status(404).json({ msg: `not found id ${req.params.id}` });
  }
});
router.put("/user/:id", (req, res) => {
  let UserJson = fs.readFileSync("./data/User.json");
  let UserOject = JSON.parse(UserJson);
  let found = UserOject.some((user) => user.id === parseInt(req.params.id));
  if (found) {
    UserOject[req.params.id].coin = req.body.coin;
    fs.writeFileSync("./data/User.json", JSON.stringify(UserOject));
    res.json(req.body);
  } else {
    res
      .status(404)
      .json({ msg: `not found data white the id ${req.params.id}` });
  }
});
//--------------------------------------------------------------
router.get("/washing_machine", (req, res) => {
  let MachineJson = fs.readFileSync("./data/Machine.json");
  let MachinOject = JSON.parse(MachineJson);
  let found = MachinOject.Washing_Machine.some(
    (machine) => machine.machine_name === req.query.washing_machine_id
  );
  if (found) {
    res.json(
      MachinOject.Washing_Machine.filter(
        (machine) => machine.machine_name === req.query.washing_machine_id
      )
    );
  } else {
    res.json(MachinOject);
  }
});
router.get("/washing_machine/:id", (req, res) => {
  let MachineJson = fs.readFileSync("./data/Machine.json");
  let MachinOject = JSON.parse(MachineJson);
  let found = MachinOject.Washing_Machine.some(
    (machine) => machine.id === parseInt(req.params.id)
  );
  if (found) {
    res.json(MachinOject.Washing_Machine[req.params.id]);
  } else {
    res.status(404).json({
      msg: `not found data white the id ${req.params.id}`,
    });
  }
});
//----------------------------------------------------------
router.get("/machineTimer", (req, res) => {
  let TimerJson = fs.readFileSync("./data/Machine_timer.json");
  let TimerOject = JSON.parse(TimerJson);
  let found = TimerOject.some(
    (TimeMachine) =>
      TimeMachine.washing_machine_id === req.query.washing_machine_id
  );
  if (found) {
    res
      .status(200)
      .json(
        TimerOject.filter(
          (timer) => timer.washing_machine_id === req.query.washing_machine_id
        )
      );
  } else {
    res.json({
      msg: `Not fund machine number ${req.query.washing_machine_id}`,
    });
  }
});
router.post("/machineTimer", (req, res) => {
  let TimerJson = fs.readFileSync("./data/Machine_timer.json");
  let TimerOject = JSON.parse(TimerJson);
  let found = TimerOject.some(
    (Timer) => Timer.washing_machine_id === req.body.washing_machine_id
  );
  if (found) {
    res.status(400).json({ msg: "information already exists" });
  } else {
    TimerOject.push(req.body);
    fs.writeFileSync("./data/Machine_timer.json", JSON.stringify(TimerOject));
    res.status(200).json({ msg: "insert data success" });
  }
});
router.put("/machineTimer", (req, res) => {
  let TimerJson = fs.readFileSync("./data/Machine_timer.json");
  let TimerOject = JSON.parse(TimerJson);
  let found = TimerOject.some(
    (Timer) => Timer.washing_machine_id === req.body.washing_machine_id
  );
  if (found) {
    TimerOject.filter((timer, index) => {
      if (timer.washing_machine_id === req.body.washing_machine_id) {
        TimerOject[index] = req.body;
        return timer;
      }
    });
    fs.writeFileSync("./data/Machine_timer.json", JSON.stringify(TimerOject));
    res.status(200).send("update success");
  } else {
    res.status(404).json("not found data.");
  }
});
//-------------------------------------------------------------
router.post("/lineMessage", (req, res) => {
  if (
    typeof req.body === "object" &&
    req.body !== null &&
    req.body !== undefined &&
    Object.keys(req.body).length > 0
  ) {
    axiosInstance
      .post("/push", {
        to: `${process.env.CHAT_GROUP}`,
        messages: [
          {
            type: "text",
            text: req.body.text,
          },
        ],
      })
      .then((res) => {
        res.send(res);
      })
      .catch((error) => {
        res.send(error);
      });
  }
});
module.exports = router;
