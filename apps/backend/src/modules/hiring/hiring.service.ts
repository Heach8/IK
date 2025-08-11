import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'crypto'

export interface CreateJobPostingDto {
  title: string
  description?: string
  storeId?: string
  isActive?: boolean
}

export interface UpdateJobPostingDto {
  title?: string
  description?: string
  storeId?: string
  isActive?: boolean
}

export interface JobPostingEntity {
  id: string
  tenantId: string
  title: string
  description?: string
  storeId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCandidateDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags?: string[]
  resumeUrl?: string
}

export interface CandidateEntity {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags: string[]
  resumeUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationDto {
  candidateId: string
  postingId: string
  stage?: string
  score?: number
  notes?: string
}

export interface UpdateApplicationDto {
  stage?: string
  score?: number
  notes?: string
}

export interface ApplicationEntity {
  id: string
  tenantId: string
  candidateId: string
  postingId: string
  stage: string
  score?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

@Injectable()
export class HiringService {
  private readonly postingsByTenant: Record<string, JobPostingEntity[]> = {}
  private readonly candidatesByTenant: Record<string, CandidateEntity[]> = {}
  private readonly applicationsByTenant: Record<string, ApplicationEntity[]> = {}

  // Job Postings
  createPosting(tenantId: string, dto: CreateJobPostingDto): JobPostingEntity {
    const now = new Date().toISOString()
    const entity: JobPostingEntity = {
      id: randomUUID(),
      tenantId,
      title: dto.title,
      description: dto.description,
      storeId: dto.storeId,
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
    if (!this.postingsByTenant[tenantId]) this.postingsByTenant[tenantId] = []
    this.postingsByTenant[tenantId].push(entity)
    return entity
  }

  listPostings(tenantId: string): JobPostingEntity[] {
    return this.postingsByTenant[tenantId] ?? []
  }

  getPosting(tenantId: string, id: string): JobPostingEntity {
    const list = this.postingsByTenant[tenantId] ?? []
    const found = list.find((p) => p.id === id)
    if (!found) throw new NotFoundException('Posting not found')
    return found
  }

  updatePosting(tenantId: string, id: string, dto: UpdateJobPostingDto): JobPostingEntity {
    const posting = this.getPosting(tenantId, id)
    if (dto.title !== undefined) posting.title = dto.title
    if (dto.description !== undefined) posting.description = dto.description
    if (dto.storeId !== undefined) posting.storeId = dto.storeId
    if (dto.isActive !== undefined) posting.isActive = dto.isActive
    posting.updatedAt = new Date().toISOString()
    return posting
  }

  // Candidates
  createCandidate(tenantId: string, dto: CreateCandidateDto): CandidateEntity {
    const now = new Date().toISOString()
    const entity: CandidateEntity = {
      id: randomUUID(),
      tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      tags: dto.tags ?? [],
      resumeUrl: dto.resumeUrl,
      createdAt: now,
      updatedAt: now,
    }
    if (!this.candidatesByTenant[tenantId]) this.candidatesByTenant[tenantId] = []
    this.candidatesByTenant[tenantId].push(entity)
    return entity
  }

  listCandidates(tenantId: string): CandidateEntity[] {
    return this.candidatesByTenant[tenantId] ?? []
  }

  getCandidate(tenantId: string, id: string): CandidateEntity {
    const list = this.candidatesByTenant[tenantId] ?? []
    const found = list.find((c) => c.id === id)
    if (!found) throw new NotFoundException('Candidate not found')
    return found
  }

  // Applications
  createApplication(tenantId: string, dto: CreateApplicationDto): ApplicationEntity {
    // simple foreign checks
    void this.getCandidate(tenantId, dto.candidateId)
    void this.getPosting(tenantId, dto.postingId)

    const now = new Date().toISOString()
    const entity: ApplicationEntity = {
      id: randomUUID(),
      tenantId,
      candidateId: dto.candidateId,
      postingId: dto.postingId,
      stage: dto.stage ?? 'applied',
      score: dto.score,
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    }
    if (!this.applicationsByTenant[tenantId]) this.applicationsByTenant[tenantId] = []
    this.applicationsByTenant[tenantId].push(entity)
    return entity
  }

  listApplications(tenantId: string): ApplicationEntity[] {
    return this.applicationsByTenant[tenantId] ?? []
  }

  getApplication(tenantId: string, id: string): ApplicationEntity {
    const list = this.applicationsByTenant[tenantId] ?? []
    const found = list.find((a) => a.id === id)
    if (!found) throw new NotFoundException('Application not found')
    return found
  }

  updateApplication(tenantId: string, id: string, dto: UpdateApplicationDto): ApplicationEntity {
    const app = this.getApplication(tenantId, id)
    if (dto.stage !== undefined) app.stage = dto.stage
    if (dto.score !== undefined) {
      if (dto.score < 0 || dto.score > 100) throw new BadRequestException('score must be 0..100')
      app.score = dto.score
    }
    if (dto.notes !== undefined) app.notes = dto.notes
    app.updatedAt = new Date().toISOString()
    return app
  }
}
