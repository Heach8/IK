import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TenantService } from './tenant.service'

export interface CreateTenantDto {
  name: string
  slug: string
}

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto)
  }

  @Get()
  findAll() {
    return this.tenantService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id)
  }
}
