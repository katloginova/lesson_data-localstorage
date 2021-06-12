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
 }

 function onListTasksClick(e) {
     const target = e.target;
     const idTask = getIdTask(target);

     switch (true) {
         case (target.classList.contains(LIST_ITEM_CLASS)):
             toggleDone(target);
             changeStateTask(idTask);
             break;
         case (target.classList.contains(DELETE_BTN_CLASS)):
             deleteTaskFromData(idTask);
             removeTaskFromList(idTask);
             break;
     }

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
         isDone: false
     };
 }

 function addNewTask(task) {
     dataTasks.push(task);
     renderTask(task);
     saveToStorage();
 }

 function renderTask(task) {
     const rowTaskHtml = getRowTaskHtml(task);

     listTasks.insertAdjacentHTML('beforeend', rowTaskHtml);
 }

 function getRowTaskHtml(task) {
     return taskTemplate
         .replace('{{id}}', task.id)
         .replace('{{classDone}}', task.isDone ? DONE_CLASS : '')
         .replace('{{task}}', task.callTask);
 }


 /*for onListTasksClick*/

 function getIdTask(elem) {
     const row = elem.closest('.' + LIST_ITEM_CLASS);
     return +row.dataset.taskId;
 }

 function toggleDone(elem) {
     elem.classList.toggle(DONE_CLASS);
 }

 function changeStateTask(id) {
     dataTasks = dataTasks.map((task) =>
         task.id !== id ?
         task : {
             ...task,
             isDone: !task.isDone
         });

     saveToStorage();
 }

 function deleteTaskFromData(id) {
     dataTasks = dataTasks.filter((item) => item.id !== id);
     saveToStorage();
 }

 function removeTaskFromList(id) {
     listTasks.querySelector(`[${TASK_ID_ATTRIBUTE_NAME}="${id}"]`).remove();
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