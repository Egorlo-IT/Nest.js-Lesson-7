import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesEntity } from "./categories.entity";
import { Roles } from "../auth/role/roles.decorator";
import { Role } from "../auth/role/role.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post("create")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async create(@Body("name") name): Promise<CategoriesEntity> {
    return this.categoriesService.create(name);
  }
}
