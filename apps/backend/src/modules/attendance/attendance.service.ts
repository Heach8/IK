import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'crypto'

export interface CreateShiftDto {
  storeId: string
  name: string
  startTime: string // ISO
  endTime: string   // ISO
}

export interface ShiftEntity {
  id: string
  tenantId: string
  storeId: string
  name: string
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export interface CreateTimesheetDto {
  employeeId: string
  workDate: string // ISO date
  shiftId?: string
  note?: string
}

export interface TimesheetEntity {
  id: string
  tenantId: string
  employeeId: string
  shiftId?: string
  workDate: string
  clockIn?: string
  clockOut?: string
  hours?: number
  overtimeMins?: number
  note?: string
}

@Injectable()
export class AttendanceService {
  private readonly shiftsByTenant: Record<string, ShiftEntity[]> = {}
  private readonly timesheetsByTenant: Record<string, TimesheetEntity[]> = {}

  // Shifts
  createShift(tenantId: string, dto: CreateShiftDto): ShiftEntity {
    const start = new Date(dto.startTime)
    const end = new Date(dto.endTime)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid startTime or endTime')
    }
    if (end <= start) throw new BadRequestException('endTime must be after startTime')

    const now = new Date().toISOString()
    const shift: ShiftEntity = {
      id: randomUUID(),
      tenantId,
      storeId: dto.storeId,
      name: dto.name,
      startTime: dto.startTime,
      endTime: dto.endTime,
      createdAt: now,
      updatedAt: now,
    }
    if (!this.shiftsByTenant[tenantId]) this.shiftsByTenant[tenantId] = []
    this.shiftsByTenant[tenantId].push(shift)
    return shift
  }

  listShifts(tenantId: string): ShiftEntity[] {
    return this.shiftsByTenant[tenantId] ?? []
  }

  // Timesheets
  createTimesheet(tenantId: string, dto: CreateTimesheetDto): TimesheetEntity {
    const date = new Date(dto.workDate)
    if (isNaN(date.getTime())) throw new BadRequestException('Invalid workDate')
    const ts: TimesheetEntity = {
      id: randomUUID(),
      tenantId,
      employeeId: dto.employeeId,
      shiftId: dto.shiftId,
      workDate: dto.workDate,
      note: dto.note,
    }
    if (!this.timesheetsByTenant[tenantId]) this.timesheetsByTenant[tenantId] = []
    this.timesheetsByTenant[tenantId].push(ts)
    return ts
  }

  listTimesheets(tenantId: string): TimesheetEntity[] {
    return this.timesheetsByTenant[tenantId] ?? []
  }

  getTimesheet(tenantId: string, id: string): TimesheetEntity {
    const list = this.timesheetsByTenant[tenantId] ?? []
    const found = list.find((t) => t.id === id)
    if (!found) throw new NotFoundException('Timesheet not found')
    return found
  }

  clockIn(tenantId: string, id: string, atIso: string): TimesheetEntity {
    const ts = this.getTimesheet(tenantId, id)
    const at = new Date(atIso)
    if (isNaN(at.getTime())) throw new BadRequestException('Invalid timestamp')
    ts.clockIn = at.toISOString()
    ts.hours = this.calculateHours(ts)
    ts.overtimeMins = this.calculateOvertime(ts)
    return ts
  }

  clockOut(tenantId: string, id: string, atIso: string): TimesheetEntity {
    const ts = this.getTimesheet(tenantId, id)
    const at = new Date(atIso)
    if (isNaN(at.getTime())) throw new BadRequestException('Invalid timestamp')
    ts.clockOut = at.toISOString()
    ts.hours = this.calculateHours(ts)
    ts.overtimeMins = this.calculateOvertime(ts)
    return ts
  }

  private calculateHours(ts: TimesheetEntity): number | undefined {
    if (!ts.clockIn || !ts.clockOut) return undefined
    const diffMs = new Date(ts.clockOut).getTime() - new Date(ts.clockIn).getTime()
    if (diffMs <= 0) return 0
    const hours = diffMs / 1000 / 60 / 60
    return Math.round(hours * 100) / 100
  }

  private calculateOvertime(ts: TimesheetEntity): number | undefined {
    if (ts.hours == null) return undefined
    const overtimeHours = Math.max(0, ts.hours - 8)
    return Math.round(overtimeHours * 60)
  }
}
