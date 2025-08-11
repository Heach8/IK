import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common'
import { AttendanceService, type CreateShiftDto, type CreateTimesheetDto } from './attendance.service'

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  private getTenantId(headers: Record<string, string | undefined>): string {
    const tenantId = headers['x-tenant-id']
    if (!tenantId) throw new Error('x-tenant-id header is required')
    return tenantId
  }

  // Shifts
  @Post('shifts')
  createShift(@Headers() headers: Record<string, string | undefined>, @Body() dto: CreateShiftDto) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.createShift(tenantId, dto)
  }

  @Get('shifts')
  listShifts(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.listShifts(tenantId)
  }

  // Timesheets
  @Post('timesheets')
  createTimesheet(
    @Headers() headers: Record<string, string | undefined>,
    @Body() dto: CreateTimesheetDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.createTimesheet(tenantId, dto)
  }

  @Get('timesheets')
  listTimesheets(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.listTimesheets(tenantId)
  }

  @Patch('timesheets/:id/clock-in')
  clockIn(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() body: { at: string },
  ) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.clockIn(tenantId, id, body.at)
  }

  @Patch('timesheets/:id/clock-out')
  clockOut(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() body: { at: string },
  ) {
    const tenantId = this.getTenantId(headers)
    return this.attendanceService.clockOut(tenantId, id, body.at)
  }
}
