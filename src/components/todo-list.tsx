"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import bgimage from "../../public/todo.jpg";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Todo {
  id: number;
  name: string;
  isDone: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, name: "Todo 1", isDone: false },
    { id: 2, name: "Todo 2", isDone: false },
    { id: 3, name: "Todo 3", isDone: false },
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter] = useState<"all" | "completed" | "pending">("all");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoText, setEditedTodoText] = useState<string>("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  // Save tasks to localStorage whenever tasks are updated
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteStaticTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditingStaticTodo = (id: number, name: string): void => {
    setEditingTodoId(id);
    setEditedTodoText(name);
  };

  const updateStaticTodo = (): void => {
    if (editedTodoText.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodoId
            ? { ...todo, name: editedTodoText }
            : todo
        )
      );
      setEditingTodoId(null);
      setEditedTodoText("");
    }
  };

  // Clear all tasks
  const clearAllTasks = (): void => {
    setTasks([]);
  };

  // Clear all static todos
  const clearAllStaticTodos = (): void => {
    setTodos([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const taskCount = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Image
          src={bgimage}
          layout="fill"
          objectFit="cover"
          alt="Background Image"
        />
        <div className="relative w-full max-w-md bg-gradient-to-br from-purple-600 via-gray-200 to-purple-600 dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h1 className="text-4xl text-bold text-center font-bold p-2 mb-4 text-gray-800 dark:text-gray-200 bg-gradient-to-br from-purple-800 via-gray-200 to-purple-400">
            Todo List
          </h1>
          <p className="text-center text-gray-700 dark:text-gray-400">
            Total: {taskCount.total}, Completed: {taskCount.completed}, Pending:{" "}
            {taskCount.pending}
          </p>

          {/* Static Todos Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Static Todos
            </h2>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400 dark:bg-gray-700 rounded-md px-4 py-2"
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={todo.isDone}
                    onCheckedChange={() =>
                      setTodos(
                        todos.map((t) =>
                          t.id === todo.id
                            ? { ...t, isDone: !t.isDone }
                            : t
                        )
                      )
                    }
                    className="mr-2"
                  />
                  {editingTodoId === todo.id ? (
                    <Input
                      type="text"
                      value={editedTodoText}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEditedTodoText(e.target.value)
                      }
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") updateStaticTodo();
                      }}
                    />
                  ) : (
                    <span
                      className={`${
                        todo.isDone
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {todo.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {editingTodoId === todo.id ? (
                    <Button
                      onClick={updateStaticTodo}
                      className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-800"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        startEditingStaticTodo(todo.id, todo.name)
                      }
                      className="text-white font-bold bg-gradient-to-br from-gray-900 via-gray-400 to-gray-900"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteStaticTodo(todo.id)}
                    className="bg-gradient-to-br from-yellow-600 via-gray-200 to-yellow-700 font-bold text-black"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <div className=" flex align-center justify-center ">
            <Button
              onClick={clearAllStaticTodos}
              className="mt-4 bg-gradient-to-br from-gray-600 via-gray-400 to-gray-600 text-white font-bold align-center w-4xl "
            >
              Clear All Static Todos
            </Button>
            </div>
          </div>

          {/* Add Task Section */}
          <div className="mb-2 ">
            <Input
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="mb-3"
            />
            <Button onClick={addTask}>Add</Button>
            
          </div>

          {/* Dynamic Tasks Section */}
          <div>
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex justify-around mb-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  <Input
                    value={editedTaskText}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                  />
                ) : (
                  <span>{task.text}</span>
                )}
                {editingTaskId === task.id ? (
                  <Button onClick={updateTask}>Save</Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                  >
                    Edit
                  </Button>
                )}
                <Button onClick={() => deleteTask(task.id)}>Delete</Button>
              </div>
            ))}
         <div className=" flex align-center justify-center ">

           <Button
              onClick={clearAllTasks}
              className=" font-bold ml-2 bg-gradient-to-br from-gray-600 via-gray-400 to-gray-600 text-white  w-100"
            >
              Clear All Tasks
            </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
