import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './modules/tenant/tenant.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HiringModule } from './modules/hiring/hiring.module';

@Module({
  imports: [TenantModule, EmployeesModule, LeavesModule, AttendanceModule, HiringModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
