import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getTasks');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };


  const handleAddTodo = async () => {
    try {
        if (inputValue.trim() !== '') {
        await axios.post('http://localhost:5000/createTask', {task: inputValue,completed:false,priority:'low' });
        setInputValue('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

    const handleDeleteTodo = (id) => {
        axios.delete(`http://localhost:5000/deleteTask/${id}`)
          .then(response => {
            console.log(response.data); 
            
          })
          .catch(error => {
            console.error('Error deleting task:', error); // Handle error
            // Optionally, you can handle specific errors or show error messages to the user
          });
      }
      const handleComplete = async (id,status) => {
        try {
          
    

            // Update completed status in the backend
         const res=   await axios.put(`http://localhost:5000/updateTask/${id}/${status}`);
         console.log('',res)
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };


  return (
    <div className="todo-container">
      <h2 className="todo-title">Todo List</h2>
      <input
        type="text"
        className="todo-input"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        placeholder="Enter a task"
      />
      <button className="todo-button" onClick={handleAddTodo}>Add Todo</button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
           <span className={todo.completed?'completed':'pending'}>{todo.task}</span> 
           <span>{todo.priority}</span>
            <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
         {todo.completed ?  <button onClick={() => handleComplete(todo.id,false)}>
                          undo
                        </button> :  <button onClick={() => handleComplete(todo.id,true)}>
                         complete
                        </button>}
                       
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList