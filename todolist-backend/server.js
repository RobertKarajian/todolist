const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//const cors = require("cors");
const app = express();
const port = 5000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'rob@1', 
  password: 'rob@1', 
  database: 'todo_db' 
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// Routes
// Example route to get all todos
app.get('/getTasks', (req, res) => {
  const sql = 'SELECT * FROM todo';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// // Example route to add a new todo
app.post('/createTask', (req, res) => {
   const {task,completed,priority} = req.body; // Assuming req.body co
    // SQL query with explicit column names for INSERT
    const sql = 'INSERT INTO todo (task,completed,priority) VALUES (?, ?, ?)';
    
    // Array containing values to be inserted
    const values = [task, completed,priority];
    console.log('todo body',req.body);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        res.status(500).send('Failed to add task');
      } else {
        console.log('Task added successfully');
        res.send('Task added');
      }
    });
  });
  app.delete('/deleteTask/:id', (req, res) => {
    const id = req.params.id;
    
    // SQL query to delete a task based on task id
    const sql = 'DELETE FROM todo WHERE id = ?';
    console.log('param id', id)
    // Value to be inserted into the query
    // const values = [id];
    
    // db.query(sql, values, (err, result) => {
    //   if (err) {
    //     console.error('Error deleting task:', err);
    //     res.status(500).send('Failed to delete task');
    //   } else {
    //     if (result.affectedRows > 0) {
    //       console.log(`Task with id ${id} deleted successfully`);
    //       res.send(`Task with id ${id} deleted`);
    //     } else {
    //       console.log(`Task with id ${id} not found`);
    //       res.status(404).send(`Task with id ${id} not found`);
    //     }
    //   }
    // });
  });
  app.put('/updateTask/:id/:status', (req, res) => {
    const taskId = req.params.id;
    const taskStatus = req.params.status;
    // SQL query to update the task
    const sql = 'UPDATE todo SET completed = ? WHERE id = ?';

    // Values to be updated
    console.log('id,status',taskId,taskStatus)

    db.query(sql, [taskId,taskStatus], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).send('Failed to update task');
        } else {
            console.log('Task updated successfully');
            res.send('Task updated');
        }
    });
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});