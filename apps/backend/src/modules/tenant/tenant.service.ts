import { Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import type { CreateTenantDto } from './tenant.controller'

export interface TenantEntity {
  id: string
  name: string
  slug: string
  createdAt: Date
}

@Injectable()
export class TenantService {
  private readonly tenants: TenantEntity[] = []

  create(dto: CreateTenantDto): TenantEntity {
    const tenant: TenantEntity = {
      id: randomUUID(),
      name: dto.name,
      slug: dto.slug,
      createdAt: new Date(),
    }
    this.tenants.push(tenant)
    return tenant
  }

  findAll(): TenantEntity[] {
    return this.tenants
  }

  findOne(id: string): TenantEntity {
    const tenant = this.tenants.find((t) => t.id === id)
    if (!tenant) throw new NotFoundException('Tenant not found')
    return tenant
  }
}
