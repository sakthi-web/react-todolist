import React, { useState, useEffect } from "react";
import { Button, Checkbox, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import './App.css';

function App() {
  const [todoName, setTodoName] = useState("");
  const [todoArr, setTodo] = useState([]);
  const [flag, setFlag] = useState("allTask");
  const [isRefreshNeeded,setIsRefreshNeeded] = useState({taskName: null, completed: null, isActive: null, id: null});

  var newArrayLength = 0;
  const baseURL = "http://localhost:9000";


  const addTodo = text => {    
    axios.post(`${baseURL}/addTask`, {
    taskName: text,
    completed: false,
    isActive: true
    })
    .then(function (response) {
      setTodo(response.data.data)
      
      setIsRefreshNeeded({
        taskName: text, 
        completed: false, 
        isActive: true, 
        id: null
      })
    })
    
  };

  const markTodo = (task,index,checkedValue,isActiveStatus) => {
   
    axios.put(`${baseURL}/${index}/update`, {
      taskName: task,
      completed: checkedValue,
      isActive : isActiveStatus
    })
    .then(function (response) {
      setTodo(response.data.data)
     
      setIsRefreshNeeded({
        taskName: task, 
        completed: checkedValue, 
        isActive: isActiveStatus, 
        id: index
      })
    })
   
  };

  const removeTodo = index => {
   
    axios.delete(`${baseURL}/${index}/delete`)
    .then(function (response) {
      setTodo(response.data.data)
     
      setIsRefreshNeeded({
        taskName: null, 
        completed: true, 
        isActive: true, 
        id: index
      })
    })
   
  };



  const activeTodo = (task,index,activeStatus) => {
   
    axios.put(`${baseURL}/${index}/update`, {
      taskName: task,
      completed: true,
      isActive: false
    })
    .then(function (response) {
      setTodo(response.data.data)
     
      setIsRefreshNeeded({
        taskName: task, 
        completed: true, 
        isActive: activeStatus, 
        id: index
      })
    })
   
  };

  const inActiveTodo = (task,index) => {
    axios.put(`${baseURL}/${index}/update`, {
      taskName: task,
      completed: true,
      isActive: false
    })
    .then(function (response)  {
      setIsRefreshNeeded('inActive')
    })
    .catch(function (error) {
      alert("Something went wrong please try again")
    });
  };

  const submit = e => {
    e.preventDefault();
    if (!todoName) return;
        addTodo(todoName);
        setTodoName("");
  };

  const errorPopup = () => 
    toast.error("Something went wrong with 'Service'...!!! Please try again", { 
      onClose: () => {
        setSpinnerFlag(false)},
        });

  useEffect(()=>{
    console.log(isRefreshNeeded,'isRefreshNeeded')
    
    axios.get(`${baseURL}/getTaskList`)
    .then(function (response) {
      setTodo(response.data.data)
     
    })
   
  },[])

  return (
    <div className="App">
     
      <h1>TodoApp with Node JS</h1>
      <form onSubmit={submit}>
        <TextField type="text" autoComplete="off" onChange={e => setTodoName(e.target.value)} value={todoName} placeholder="Add Task" />
        <Button className="ml-2 mt-2" variant="contained" startIcon={<AddIcon />} type="button" onClick={submit}> Add </Button>
      </form>
     
      <div className="buttoncontainer">
      <Button className={`mr-2 ${flag === 'allTask' ? "colorChange" : ""}`} variant="contained" onClick={(e) => { setFlag("allTask") }}>All</Button>
        <Button className={`mr-2 ${flag === 'active' ? "colorChange" : ""}`} variant="contained" onClick={() => { setFlag("active") }}>Active</Button>

        <Button className={`mr-2 ${flag === 'checked' ? "colorChange" : ""}`} variant="contained" onClick={() => { setFlag("checked") }}>Checked</Button>
      </div>
      
      <div className="listcontainer">
     
      <div  className="pt-2 pb-2">
      {(() => {
        if (flag === 'checked') {
          return (
            <div className="px-5">You are viewing <span className="highlighttxt">Checked</span> Item</div>
          )
        }
        if (flag === 'active') {
          return (
            <div className="px-5">You are viewing <span className="highlighttxt">Active</span> Item</div>
          )
        }
        if (flag === 'allTask' && todoArr.length > 0) {
          return (
            <div className="px-5">You are viewing <span className="highlighttxt">All</span> Items</div>
          )
        }
        return null;
      })()}
      </div>


      <ul id="todo-list">
        {flag === "allTask" && todoArr.map((todo, index) => (
          <Todo
            key={index}
            id={index}
            todo={todo}
            activeTodo={activeTodo}
            inActiveTodo={inActiveTodo}
            markTodo={markTodo}
            removeTodo={removeTodo}
          />

        ))}
        {flag === "checked" && todoArr.map((todo, index) => {
          if (todo.completed === true) {
            newArrayLength++
            return <Todo
              key={index}
              todo={todo}
              activeTodo={activeTodo}
              inActiveTodo={inActiveTodo}
              markTodo={markTodo}
              removeTodo={removeTodo}
            />
          }
        })}
        {flag === "active" && todoArr.map((todo, index) => {
          if (todo.isActive === false) {
            newArrayLength++
            return <Todo
              key={index}
              todo={todo}
              activeTodo={activeTodo}
              inActiveTodo={inActiveTodo}
              markTodo={markTodo}
              removeTodo={removeTodo}
            />
          }
        })}

      </ul>
      <div  className="tabstatus">
      <span >Total List in Current Tab: <span className="highlighttxt">{flag == "allTask" ? todoArr.length : newArrayLength}</span></span>
      </div>
     </div>
    </div>
  );
}

const Todo = (props) => {
  return (
    <div className="all-item">
      <div className="todo-item">
        <div>
          <Checkbox
            className="todo-checkbox"
            type="checkbox"
            checked={props.todo.completed}
            onChange={e => props.markTodo(props.todo.taskName, props.todo.id, e.target.checked, props.todo.isActive)}
          />
        </div>
        <div className={`adjust ${!props.todo.isActive ? "checked" : ""}`}>
          {props.todo.taskName}
        </div>
        {(() => {
          if (props.todo.completed) {
            return (
              <div className="todo-item">
                <div>
                  <Button variant="outlined" startIcon={<RemoveIcon />} className="todo-remove mr-2" onClick={() => props.removeTodo(props.todo.id)}>
                    Remove
                  </Button>
                </div>
                {(() => {
                  if (props.todo.isActive) {
                    return (
                      <div>
                        <Button variant="contained" className={`todo-remove mr-2 ${!props.todo.isActive ? "colorChange" : ""}`} onClick={() => { props.activeTodo(props.todo.taskName, props.todo.id, props.todo.isActive) }}>
                          Active
                        </Button>
                      </div>
                    )
                  }
                })()}

                <div>
               
                </div>
              </div>
            )
          }
          return null;
        })()}
      </div>

    </div>

  );
};

export default App;