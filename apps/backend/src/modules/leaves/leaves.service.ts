import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { randomUUID } from 'crypto'

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'COMPENSATORY'

export interface CreateLeaveRequestDto {
  employeeId: string
  type: LeaveType
  startDate: string // ISO
  endDate: string // ISO
  days: number
  note?: string
}

export interface UpdateLeaveStatusDto {
  approverId?: string
  note?: string
}

export interface LeaveRequestEntity {
  id: string
  tenantId: string
  employeeId: string
  type: LeaveType
  status: LeaveStatus
  startDate: string
  endDate: string
  days: number
  approverId?: string
  note?: string
  createdAt: string
  updatedAt: string
}

@Injectable()
export class LeavesService {
  private readonly leavesByTenant: Record<string, LeaveRequestEntity[]> = {}

  create(tenantId: string, dto: CreateLeaveRequestDto): LeaveRequestEntity {
    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('endDate must be after startDate')
    }
    const now = new Date().toISOString()
    const entity: LeaveRequestEntity = {
      id: randomUUID(),
      tenantId,
      employeeId: dto.employeeId,
      type: dto.type,
      status: 'PENDING',
      startDate: dto.startDate,
      endDate: dto.endDate,
      days: dto.days,
      note: dto.note,
      createdAt: now,
      updatedAt: now,
    }
    if (!this.leavesByTenant[tenantId]) this.leavesByTenant[tenantId] = []
    this.leavesByTenant[tenantId].push(entity)
    return entity
  }

  findAll(tenantId: string): LeaveRequestEntity[] {
    return this.leavesByTenant[tenantId] ?? []
  }

  findOne(tenantId: string, id: string): LeaveRequestEntity {
    const list = this.leavesByTenant[tenantId] ?? []
    const found = list.find((l) => l.id === id)
    if (!found) throw new NotFoundException('Leave request not found')
    return found
  }

  approve(tenantId: string, id: string, payload: UpdateLeaveStatusDto): LeaveRequestEntity {
    const req = this.findOne(tenantId, id)
    if (req.status !== 'PENDING') throw new BadRequestException('Only PENDING can be approved')
    req.status = 'APPROVED'
    req.approverId = payload.approverId
    if (payload.note) req.note = payload.note
    req.updatedAt = new Date().toISOString()
    return req
  }

  reject(tenantId: string, id: string, payload: UpdateLeaveStatusDto): LeaveRequestEntity {
    const req = this.findOne(tenantId, id)
    if (req.status !== 'PENDING') throw new BadRequestException('Only PENDING can be rejected')
    req.status = 'REJECTED'
    req.approverId = payload.approverId
    if (payload.note) req.note = payload.note
    req.updatedAt = new Date().toISOString()
    return req
  }

  cancel(tenantId: string, id: string, payload?: UpdateLeaveStatusDto): LeaveRequestEntity {
    const req = this.findOne(tenantId, id)
    if (req.status === 'CANCELLED') return req
    req.status = 'CANCELLED'
    if (payload?.note) req.note = payload.note
    req.updatedAt = new Date().toISOString()
    return req
  }
}
