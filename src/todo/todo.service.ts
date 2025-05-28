import { Injectable, NotFoundException } from "@nestjs/common";
import { Todo } from "./entities/todo.entity";
import { AddTodoDto } from "./dto/add-todo.dto";

@Injectable()
export class TodoService {
  todos: Todo[] = [];
  // Récupération de tous les todos disponibles
  getTodos(): Todo[] {
    return this.todos;
  }

  // Ajout d’un nouveau todo en générant un ID automatiquement

  addTodo(newTodo: AddTodoDto): Todo {
    const { name, description } = newTodo;
    let id;

    if (this.todos.length) {
      id = this.todos[this.todos.length - 1].id + 1;
    } else {
      id = 1;
    }
    const todo = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id,
      name,
      description,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }
  // Recherche d’un todo par son ID, avec gestion d’erreur si introuvable

  getTodoById(id: number): Todo {
    const todo = this.todos.find((actualTodo) => actualTodo.id === id);
    if (todo) return todo;
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas`);
  }
  // Suppression d’un todo par son ID, déclenche une erreur si non trouvé

  deleteTodo(id: number) {
    //Chercher l'objet via son id dans le tableau des todos
    const index = this.todos.findIndex((todo) => todo.id === +id);

    //utiliser la methode slice pour supprimer le todo s'il existe
    if (index >= 0) {
      this.todos.splice(index, 1);
    } else {
      throw new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }

    //sinon je vais declencher une erreur
    return {
      message: `Le todo d'id ${id} a bien été supprimé`,
      count: 1,
    };
  }

  updateTodo(id: number, newTodo: Partial<Todo>) {
    // Chercher l'objet via son id dans le tableau des todos
    const todo = this.getTodoById(id); // TypeScript sait que id est une string
    todo.description = newTodo.description ?? todo.description;
    todo.name = newTodo.name ?? todo.name;
    return todo;
  }
}
