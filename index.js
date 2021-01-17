const express = require('express')
const {exec} = require("child_process");
const port = 4000;
const WebSocket = require("ws");
const ws = new WebSocket("wss://https://htn2020.herokuapp.com/", {
  origin: "https://htn2020.herokuapp.com/",
});

ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function incoming(data) {
  console.log(`Roundtrip time: ${Date.now() - data} ms`);

  setTimeout(function timeout() {
    ws.send(Date.now());
  }, 500);
});
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/test', (req, res) => {
  exec("git log", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  res.sendStatus(20);
});

app.get('/git_init', (req, res) => {
  link = "https://github.com/chenIsai/testrepo.git";
  exec("git init", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Done initializing");
    exec(`git remote add origin ${link}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log("Set origin");
    });
  });
  res.sendStatus(200);
});

app.get('/git_commit', (req, res) => {
  exec(`git commit -m ${message}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Sent commit");
  });
  res.sendStatus(200);
})

app.get('/git_push', (req, res) => {
  exec(`git push -u origin master`, (error, stout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Pushed to master");
  });
  res.sendStatus(200);
})


app.listen(port, () => {
  console.log(`Gitalk app listening at htpp://localhost:${port}`)
})
