import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common'
import { HiringService, type CreateJobPostingDto, type UpdateJobPostingDto, type CreateCandidateDto, type CreateApplicationDto, type UpdateApplicationDto } from './hiring.service'

@Controller('hiring')
export class HiringController {
  constructor(private readonly hiringService: HiringService) {}

  private getTenantId(headers: Record<string, string | undefined>): string {
    const tenantId = headers['x-tenant-id']
    if (!tenantId) throw new Error('x-tenant-id header is required')
    return tenantId
  }

  // Postings
  @Post('postings')
  createPosting(@Headers() headers: Record<string, string | undefined>, @Body() dto: CreateJobPostingDto) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.createPosting(tenantId, dto)
  }

  @Get('postings')
  listPostings(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.listPostings(tenantId)
  }

  @Get('postings/:id')
  getPosting(@Headers() headers: Record<string, string | undefined>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.getPosting(tenantId, id)
  }

  @Patch('postings/:id')
  updatePosting(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() dto: UpdateJobPostingDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.updatePosting(tenantId, id, dto)
  }

  // Candidates
  @Post('candidates')
  createCandidate(@Headers() headers: Record<string, string | undefined>, @Body() dto: CreateCandidateDto) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.createCandidate(tenantId, dto)
  }

  @Get('candidates')
  listCandidates(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.listCandidates(tenantId)
  }

  @Get('candidates/:id')
  getCandidate(@Headers() headers: Record<string, string | undefined>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.getCandidate(tenantId, id)
  }

  // Applications
  @Post('applications')
  createApplication(
    @Headers() headers: Record<string, string | undefined>,
    @Body() dto: CreateApplicationDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.createApplication(tenantId, dto)
  }

  @Get('applications')
  listApplications(@Headers() headers: Record<string, string | undefined>) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.listApplications(tenantId)
  }

  @Get('applications/:id')
  getApplication(@Headers() headers: Record<string, string | undefined>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.getApplication(tenantId, id)
  }

  @Patch('applications/:id')
  updateApplication(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    const tenantId = this.getTenantId(headers)
    return this.hiringService.updateApplication(tenantId, id, dto)
  }
}
