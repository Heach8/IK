import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common'
import type { CreateEmployeeDto } from './employees.service'
import { EmployeesService } from './employees.service'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  private getTenantId(headers: Record<string, string | undefined>): string {
    const tenantId = headers['x-tenant-id']
    if (!tenantId) throw new Error('x-tenant-id header is required')
    return tenantId
  }

  @Post()
  create(@Headers() headers: Record<string, string | undefined>, @Body() dto: CreateEmployeeDto) {
    const tenantId = this.getTenantId(headers)
    return this.employeesService.create(tenantId, dto)
  }

  @Get()
  findAll(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.employeesService.findAll(tenantId)
  }

  @Get(':id')
  findOne(@Headers() headers: Record<string, string | undefined>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers)
    return this.employeesService.findOne(tenantId, id)
  }
}
