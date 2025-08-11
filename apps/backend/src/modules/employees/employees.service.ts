import { Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'crypto'

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  department?: string
  hireDate: string // ISO
}

export interface EmployeeEntity {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  department?: string
  status: 'ACTIVE' | 'TERMINATED' | 'SUSPENDED'
  hireDate: string
  terminationDate?: string
  createdAt: string
  updatedAt: string
}

@Injectable()
export class EmployeesService {
  private readonly employeesByTenant: Record<string, EmployeeEntity[]> = {}

  create(tenantId: string, dto: CreateEmployeeDto): EmployeeEntity {
    const nowIso = new Date().toISOString()
    const entity: EmployeeEntity = {
      id: randomUUID(),
      tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      position: dto.position,
      department: dto.department,
      status: 'ACTIVE',
      hireDate: dto.hireDate,
      createdAt: nowIso,
      updatedAt: nowIso,
    }
    if (!this.employeesByTenant[tenantId]) this.employeesByTenant[tenantId] = []
    this.employeesByTenant[tenantId].push(entity)
    return entity
  }

  findAll(tenantId: string): EmployeeEntity[] {
    return this.employeesByTenant[tenantId] ?? []
  }

  findOne(tenantId: string, id: string): EmployeeEntity {
    const list = this.employeesByTenant[tenantId] ?? []
    const found = list.find((e) => e.id === id)
    if (!found) throw new NotFoundException('Employee not found')
    return found
  }

  terminate(tenantId: string, id: string, terminationDate: string): EmployeeEntity {
    const emp = this.findOne(tenantId, id)
    emp.status = 'TERMINATED'
    emp.terminationDate = terminationDate
    emp.updatedAt = new Date().toISOString()
    return emp
  }
}
