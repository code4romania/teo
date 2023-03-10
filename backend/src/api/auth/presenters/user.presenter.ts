import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CityPresenter } from 'src/api/location/presenters/city.presenter';
import { SEX } from 'src/modules/user/enums/user.enum';
import { IRegularUserModel } from 'src/modules/user/models/regular-user.model';

export class RegularUserPresenter {
  constructor(user: IRegularUserModel) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.birthday = user.birthday;
    this.sex = user.sex;
    this.profilePicture = user.profilePicture;
    this.location = user.location ? new CityPresenter(user.location) : null;
  }

  @Expose()
  @ApiProperty({
    description: 'The uuid of the user',
    example: '525dcdf9-4117-443e-a0c3-bf652cdc5c1b',
  })
  id: string;

  @Expose()
  @ApiProperty({ description: 'The user name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'The user email' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'The user phone' })
  phone: string;

  @Expose()
  @ApiProperty({ description: 'The user birthday' })
  birthday: Date;

  @Expose()
  @ApiProperty({ description: 'The user name', enum: SEX, example: SEX.MALE })
  sex: SEX;

  @Expose()
  @ApiProperty({ description: 'The user birthday' })
  profilePicture?: string;

  @Expose()
  @ApiProperty({ description: 'The users location' })
  location: CityPresenter;
}
