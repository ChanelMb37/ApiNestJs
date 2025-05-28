/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Req,
  Res,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";

import { Todo } from "./entities/todo.entity";
import { GetPaginatedTodoDto } from "./dto/get-paginated-todo.dto";
import { AddTodoDto } from "./dto/add-todo.dto";
import { TodoService } from "./todo.service";
import { UpperAndFusionPipe } from "src/pipes/upper-and-fusion/upper-and-fusion.pipe";

@Controller("todo")
export class TodoController {
  constructor(private todoService: TodoService) {}

  // Gestion d'une route GET /todo/V2 avec accès direct à Express Request et Response
  @Get("V2")
  getTodoV2(@Req() request: Request, @Res() response: Response) {
    console.log("Récupérer la liste des Todos");
    response.status(205).json({
      contenue: "Je suis une réponse générée à partir de l'objet Response de Express",
    });
  }

  // Route GET /todo qui récupère la liste des todos (avec gestion des query params paginés, mais non utilisés ici)
  @Get()
  getTodos(@Query() mesQueryParams: GetPaginatedTodoDto): Todo[] {
    return this.todoService.getTodos();
  }

  // Route GET /todo/:id avec validation et parsing de l'id via ParseIntPipe (404 si invalide)
  @Get(":id")
  getTodoById(
    @Param(
      "id",
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
      }),
    )
    id,
  ) {
    return this.todoService.getTodoById(id);
  }

  // Route POST /todo pour créer un nouveau todo, avec validation automatique via DTO AddTodoDto
  @Post()
  addTodo(@Body() newTodo: AddTodoDto): Todo {
    return this.todoService.addTodo(newTodo);
  }

  // Route DELETE /todo/:id pour supprimer un todo, id parsé en entier automatiquement
  @Delete(":id")
  deleteTodo(@Param("id", ParseIntPipe) id) {
    return this.todoService.deleteTodo(id);
  }

  // Route PUT /todo/:id pour modifier un todo, id parsé, et body partiel accepté
  @Put(":id")
  modifierTodo(@Param("id", ParseIntPipe) id, @Body() newTodo: Partial<AddTodoDto>) {
    return this.todoService.updateTodo(id, newTodo);
  }

  // Route POST /todo/pipe pour tester un pipe custom (UpperAndFusionPipe) sur un paramètre (ici non utilisé)
  @Post("pipe")
  testPipe(
    @Param('data', UpperAndFusionPipe) paramData,
    // @Query("id", ParseIntPipe) queryId, 
    @Body() data
  ) {
    return data;
  }
}
