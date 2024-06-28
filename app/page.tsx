"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs); // Configura Amplify con los outputs generados.

const client = generateClient<Schema>(); // Genera un cliente para interactuar con la base de datos.

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState(""); // Estado para el valor del input

  // Función para listar las tareas.
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos(); // Inicialmente carga las listas de tareas.
  }, []);

  // Función para crear una nueva tarea.
  function createTodo() {
    if (newTodoContent.trim() === "") return; // Verifica que el contenido no esté vacío
    client.models.Todo.create({ content: newTodoContent }).then(() => {
      setNewTodoContent(""); // Limpia el input después de crear la tarea
    });
  }

  // Función para eliminar una tarea.
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Tareas de {user?.signInDetails?.loginId}</h1>
          <div>
            <input
              type="text"
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              placeholder="Nueva tarea"
            />
            <button onClick={createTodo}>Agregar</button>
          </div>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.content}
              </li>
            ))}
          </ul>
          <button onClick={signOut}>Cerrar Sesión</button>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
              Review next steps of this tutorial.
            </a>
          </div>
        </main>
      )}
    </Authenticator>
  );
}
