import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common'
import { LeavesService, type CreateLeaveRequestDto, type UpdateLeaveStatusDto } from './leaves.service'

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  private getTenantId(headers: Record<string, string | undefined>): string {
    const tenantId = headers['x-tenant-id']
    if (!tenantId) throw new Error('x-tenant-id header is required')
    return tenantId
  }

  @Post()
  create(@Headers() headers: Record<string, string | undefined>, @Body() dto: CreateLeaveRequestDto) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.create(tenantId, dto)
  }

  @Get()
  list(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.findAll(tenantId)
  }

  @Get(':id')
  get(@Headers() headers: Record<string, string | undefined>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.findOne(tenantId, id)
  }

  @Patch(':id/approve')
  approve(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() payload: UpdateLeaveStatusDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.approve(tenantId, id, payload)
  }

  @Patch(':id/reject')
  reject(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() payload: UpdateLeaveStatusDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.reject(tenantId, id, payload)
  }

  @Patch(':id/cancel')
  cancel(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() payload: UpdateLeaveStatusDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.leavesService.cancel(tenantId, id, payload)
  }
}
