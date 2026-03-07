// FILE: packages/shared-services/src/api/index.ts
export { ApiClient, createApiClient } from './api-client';
export type { ApiConfig, ApiResponse, ApiError } from './api-client';

export { authService } from './auth.service';
export { orgService } from './org.service';
export { agencyService } from './agency.service';
export { staffService } from './staff.service';
export { vehicleService } from './vehicle.service';
export { driverService } from './driver.service';
export { notifService } from './notif.service';
export { extraService } from './extra.service';
export { rentalService } from './rental.service';
export { statsService } from './stats.service';
export { transactionService } from './transaction.service';