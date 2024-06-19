"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";   //se encarga de leerlo
import "@aws-amplify/ui-react/styles.css";
import {Authenticator} from '@aws-amplify/ui-react'  //Esto lo importamos para utilizar la authentication

Amplify.configure(outputs); // la cadena de coneccion - the blockchain jjj
 
const client = generateClient<Schema>(); //la coneccion a base de datos

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  //y toda la informacion viene desde models
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({   //esto actualiza la informacion cada vez que cambia el backend
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => { //inicialmente el carga las listas de tareas
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id})  //client es la base de datos 
  
  }
 //Este componente viene desde  @aws-amplify/ui-react  --> <Authenticator>  
  return (
    <Authenticator>  
    {({signOut, user})=>(
      <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}
              onClick={() => deleteTodo(todo.id)}
          >{todo.content}</li>
        ))}
      </ul>
      <button onClick={signOut}>Cerrar Sesion</button>
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
