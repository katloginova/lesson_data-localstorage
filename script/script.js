'use strict';

const LIST_ITEM_CLASS = 'list__item';
const DONE_CLASS = 'done';
const DELETE_BTN_CLASS = 'delete-btn';
const TASK_ID_ATTRIBUTE_NAME = 'data-task-id';

const taskTemplate = document.getElementById('taskTemplate').innerHTML;
const inputTask = document.getElementById('todo');
const listTasks = document.getElementById('todolist');

let dataTasks = [];


document.getElementById('btnAdd').addEventListener('click', onAddTaskClick);
listTasks.addEventListener('click', onListTasksClick);


init();

function onAddTaskClick() {
    if (!isEmpty(inputTask.value)) {
        const formTask = getFormData();

        addNewTask(formTask);
    }

    resetInput(inputTask);
    saveToStorage();
}

function onListTasksClick(e) {
    const target = e.target;
    const idTask = getIdTask(target);

    toggleDone(target, idTask);
    
    if(target.classList.contains(DONE_CLASS)){
        changeStateTask(idTask, DONE_CLASS);
    } else {
        changeStateTask(idTask, '');
    }

    if (target.classList.contains(DELETE_BTN_CLASS)) {
        deleteTaskFromData(idTask);
        removeTaskFromList(idTask);
    }

    saveToStorage();
}


/*for onAddTaskClick*/

function isEmpty(str) {
    return str.trim() === '';
}

function resetInput(str) {
    str.value = '';
}

function getFormData() {
    return {
        id: Date.now(),
        callTask: inputTask.value,
        state: ''
    };
}

function addNewTask(task) {
    dataTasks.push(task);
    renderTask(task);
}

function renderTask(task) {
    const rowTaskHtml = getRowTaskHtml(task);

    listTasks.insertAdjacentHTML('beforeend', rowTaskHtml);
}

function getRowTaskHtml(task) {
    return taskTemplate
        .replace('{{id}}', task.id)
        .replace('{{classDone}}', task.state)
        .replace('{{task}}', task.callTask);
}


/*for onListTasksClick*/

function toggleDone(elem) {
    if(elem.classList.contains(LIST_ITEM_CLASS)){
        elem.classList.toggle(DONE_CLASS);
    }
}

function changeStateTask(id, classState) {
    dataTasks.forEach((task) => {
        if (task.id === id) {
            return (task.state = classState);
        }
    });

    return dataTasks;
}

function deleteTaskFromData(id) {
    dataTasks = dataTasks.filter((item) => item.id !== id);
}

function removeTaskFromList(id) {
    const taskElement = getTaskElement(id);
    taskElement.remove();
}

function getIdTask(elem) {
    const row = elem.closest('.' + LIST_ITEM_CLASS);
    return +row.dataset.taskId;
}

function getTaskElement(id) {
    return listTasks.querySelector(`[${TASK_ID_ATTRIBUTE_NAME}="${id}"]`);
}


/*for localStorage */

function saveToStorage() {
    localStorage.setItem('listTasks', JSON.stringify(dataTasks));
}

function restoreFromStorage() {
    return JSON.parse(localStorage.getItem('listTasks'));
}

function init() {
    dataTasks = restoreFromStorage();

    if (dataTasks !== null) {
        dataTasks.forEach((task) => renderTask(task));
    } else {
        dataTasks = [];
    }
}

