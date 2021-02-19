import React, { Component } from 'react';

class ToDoList extends Component {
    constructor() {
        super();
        this.state = {
            selectedTab: 'all',
            allTask: []
        }
    }

    componentDidMount = () => {
        let data = localStorage.getItem("to_do");
        if (data) {
            data = JSON.parse(data);
            this.setState({ allTask: data.allTask });
        }
    }

    handleTextValue = (e) => {
        this.setState({ textValue: e.target.value });
    }

    addTodo = () => {
        if (!this.state.textValue) return;
        let allTask = this.state.allTask;

        allTask.unshift({
            edit: false,
            value: this.state.textValue,
            sec: this.state.textValue,
            id: Math.random() * 1000000000,
            complete: false
        });

        this.setState({ textValue: '' });
        this.set_to_do_list(allTask);
    }

    parseData = (list, type) => {
        let count = 0, newList = [];
        for (let i = 0; i < list.length; i++)
            if (!list[i].complete)
                count++;

        if (type == 'all') newList = list;
        else if (type == 'active') newList = list.filter(x => !x.complete);
        else newList = list.filter(x => x.complete);

        return {
            represent: newList,
            left: count
        }
    }

    clearComplete = () => {
        let allTask = this.state.allTask;
        allTask = allTask.filter(x => !x.complete);
        this.set_to_do_list(allTask);
    }

    handleCompleteTask = (id) => {
        let allTask = this.state.allTask;
        for (let i = 0; i < allTask.length; i++)
            if (allTask[i].id == id) allTask[i].complete = allTask[i].complete ? false : true
        this.set_to_do_list(allTask);
    }

    handleDeleteTask = (id) => {
        let allTask = this.state.allTask;
        allTask = allTask.filter(x => x.id != id);
        this.set_to_do_list(allTask);
    }

    handleOpenEditTask = (id) => {
        let allTask = this.state.allTask;
        for (let i = 0; i < allTask.length; i++)
            if (allTask[i].id == id) allTask[i].edit = allTask[i].edit ? false : true;
            else allTask[i].edit = false;

        this.set_to_do_list(allTask);
    }

    updateWriteCommand = (id) => {
        let allTask = this.state.allTask;
        for (let i = 0; i < allTask.length; i++)
            if (allTask[i].id == id) {
                allTask[i].value = this.state.updatedValue;
                allTask[i].edit = false;
            }
            else allTask[i].sec = allTask[i].value;

        this.set_to_do_list(allTask);
    }

    handleEditClose = () => {
        let allTask = this.state.allTask;
        for (let i = 0; i < allTask.length; i++) {
            allTask[i].edit = false;
            allTask[i].sec = allTask[i].value;
        }
        this.set_to_do_list(allTask);
    }

    changeToDo = (e, id) => {
        let allTask = this.state.allTask;
        for (let i = 0; i < allTask.length; i++)
            if (allTask[i].id == id) allTask[i].sec = e.target.value;

        this.set_to_do_list(allTask);
    }

    set_to_do_list = (allTask) => {
        localStorage.setItem('to_do', JSON.stringify({ allTask }));
        this.setState({ allTask: allTask });
    }

    render() {
        let { textValue, allTask, selectedTab } = this.state;
        let { represent, left } = this.parseData(allTask, selectedTab);
        return (
            <>
                <div id="hero" className="hero">
                    <h1 className="title">To Do List</h1>
                    <div id="todoApp" className="todo-app">
                        <div className="row pt-4 pl-3 pr-1" >
                            <div className="col-10">
                                <input className="add-todo-text-input" placeholder="What do you need to do?" value={textValue} onChange={this.handleTextValue}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            this.addTodo()
                                        }
                                    }} autofocus={true} />
                            </div>
                            <div className="col-2">
                                <div className="btn btn-outline-primary" onClick={this.addTodo}> Add</div>
                            </div>
                        </div>

                        <ul id="todos" className="todos mt-3" aria-label="List of to do tasks">
                            {represent.map(data => {
                                return <li
                                    style={{ background: data.complete ? 'lightgreen' : '' }}
                                >
                                    <div className="row pt-2 pb-1" style={{
                                        borderTop: '1px solid #e6e6e6'
                                    }}>
                                        <div className="col-1 pl-4" onClick={() => this.handleCompleteTask(data.id)}>
                                            <input type="checkbox" checked={data.complete} />
                                            <label for={data.id}  ></label>
                                        </div>
                                        <div className="col-9">
                                            <input className="add-todo-text-input"
                                                value={data.edit ? data.sec : data.value}
                                                onChange={(e) => this.changeToDo(e, data.id)}
                                                disabled={!data.edit}
                                                style={{ background: data.complete ? 'lightgreen' : '', opacity: !data.edit ? '0.5' : '1' }} />
                                        </div>
                                        <div className="col-2">
                                            {data.edit ?
                                                <img src="data:image/png;base64,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"
                                                    className="editlogo" onClick={() => this.updateWriteCommand(data.id)} />
                                                :
                                                <img src="https://image.flaticon.com/icons/png/512/1170/1170177.png" className="editlogo" onClick={() => { this.handleOpenEditTask(data.id) }} />
                                            }
                                            <button className="delete-button" onClick={() => { if (data.edit) this.handleEditClose(); else this.handleDeleteTask(data.id) }}>×</button>
                                        </div>
                                    </div>
                                </li>

                            })}

                        </ul>
                        <div id="todoMenu2" className="todo-menu-2">
                            <label id="todosLeft" className="todos-left" aria-label="Number of to do tasks left to complete"> Task Left: {left}</label>
                            <div id="todoMenu2Buttons" className="todo-menu-2-buttons">
                                <button id="showAllTodos" className="menu-2-button active" aria-label="Show all to do tasks" onClick={() => this.setState({ selectedTab: 'all' })}>All</button>
                                <button id="showUncompletedTodos" className="menu-2-button" aria-label="Show active to do tasks" onClick={() => this.setState({ selectedTab: 'active' })}>Active</button>
                                <button id="showCompletedTodos" className="menu-2-button" aria-label="Show completed to do tasks" onClick={() => this.setState({ selectedTab: 'complete' })}>Completed</button>
                            </div>
                            <button id="deleteCompletedButton" className="delete-completed-button" aria-label="Clear completed to do tasks" onClick={this.clearComplete}>Clear completed</button>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}

export default ToDoList;