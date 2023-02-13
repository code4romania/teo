import { AccessCodeError } from './entities/access-request.errors';
import { DivisionError } from './entities/division.errors';
import { OrganizationError } from './entities/organization.errors';
import { VolunteerError } from './entities/volunteer.errors';
import { VolunteersErrors } from './entities/volunteers.errors';

// Here we list all the group of errors for every page
export class InternalErrors {
  public static ORGANIZATION_ERRORS = OrganizationError.getInstance();
  public static DIVISION_ERRORS = DivisionError.getInstance();
  public static VOLUNTEER_ERRORS = VolunteerError.getInstance();
  public static VOLUNTEERS_ERRORS = VolunteersErrors.getInstance();
  public static ACCESS_CODE_ERRORS = AccessCodeError.getInstance();
}
