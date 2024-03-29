import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { WorkScheduleDTO } from 'src/app/dto/work-schedule-dto.model';
import { CityResponse } from 'src/app/response/city-response.model';
import { DistrictResponse } from 'src/app/response/district-response.model';
import { WardResponse } from 'src/app/response/ward-response.model';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-update-doctor-profile',
  templateUrl: './update-doctor-profile.component.html',
  styleUrls: ['./update-doctor-profile.component.css'],
})
export class UpdateDoctorProfileComponent {
  @ViewChild('updateDoctorProfileForm', { static: false })
  updateDoctorProfileForm!: NgForm;

  cities: CityResponse[] = [];
  districts: DistrictResponse[] = [];
  wards: WardResponse[] = [];
  wardId!: number;
  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  successMessage = '';
  gender!: number;
  selectedCity = 0;
  selectedValue = 0;
  isDistrictsDisabled = false;
  isWardsDisabled = false;

  workSchedulesDTO: WorkScheduleDTO[] = [
    new WorkScheduleDTO('08:00', '08:30'),
    new WorkScheduleDTO('08:30', '09:00'),
    new WorkScheduleDTO('09:00', '09:30'),
    new WorkScheduleDTO('09:30', '10:00'),
    new WorkScheduleDTO('10:30', '11:00'),
    new WorkScheduleDTO('11:00', '11:30'),
    new WorkScheduleDTO('11:30', '12:00'),
    new WorkScheduleDTO('13:30', '14:00'),
    new WorkScheduleDTO('14:00', '14:30'),
    new WorkScheduleDTO('14:30', '15:00'),
    new WorkScheduleDTO('15:00', '15:30'),
    new WorkScheduleDTO('13:30', '16:00'),
    new WorkScheduleDTO('16:30', '17:00'),
    new WorkScheduleDTO('17:00', '17:30'),
    new WorkScheduleDTO('17:30', '18:00'),
    new WorkScheduleDTO('18:00', '18:30'),
    new WorkScheduleDTO('18:30', '19:00'),
    new WorkScheduleDTO('19:00', '19:30'),
    new WorkScheduleDTO('19:30', '20:00'),
  ];

  workSchedules: WorkScheduleDTO[] = [];

  constructor(
    private userService: UserService,
    private httpClient: HttpClient,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCities().subscribe((result: CityResponse[]) => {
      this.cities = result;
    });
    if (this.selectedCity == 0) {
      this.isDistrictsDisabled = true;
      this.isWardsDisabled = true;
    }
  }

  getCities(): Observable<CityResponse[]> {
    return this.httpClient
      .get<CityResponse[]>('http://localhost:8080/address/cities')
      .pipe(
        map((response) => {
          if (response) {
            return Object.values(response);
          }
          return [];
        })
      );
  }

  changeCity(e: any) {
    this.httpClient
      .get<DistrictResponse[]>(
        'http://localhost:8080/address/districts/' + e.target.value
      )
      .pipe(
        map((response) => {
          if (response) {
            return Object.values(response);
          }
          return [];
        })
      )
      .subscribe((result: DistrictResponse[]) => {
        this.districts = result;
      });
    if (e.target.value == 0) {
      this.isDistrictsDisabled = true;
      this.isWardsDisabled = true;
    } else {
      this.isDistrictsDisabled = false;
    }
    this.wards = [];
  }

  changeDistrict(e: any) {
    this.httpClient
      .get<WardResponse[]>(
        'http://localhost:8080/address/wards/' + e.target.value
      )
      .pipe(
        map((response) => {
          if (response) {
            return Object.values(response);
          }
          return [];
        })
      )
      .subscribe((result: WardResponse[]) => {
        this.wards = result;
      });
    if (e.target.value == 0) {
      this.isWardsDisabled = true;
    } else {
      this.isWardsDisabled = false;
    }
  }

  changeWard(e: any) {
    if (e.target.value != 0) {
      this.wardId = e.target.value;
    }
  }

  onChangeWorkSchedules(workSchedule: WorkScheduleDTO) {
    if (this.workSchedules.includes(workSchedule)) {
      this.workSchedules = this.workSchedules.filter(
        (item) => item !== workSchedule
      );
    } else {
      this.workSchedules.push(workSchedule);
    }
    console.log(this.workSchedules);
  }

  onSubmit() {
    const doctorProfileRequest = {
      firstName: this.updateDoctorProfileForm.value.firstName,
      lastName: this.updateDoctorProfileForm.value.lastName,
      dateOfBirth: this.updateDoctorProfileForm.value.dateOfBirth,
      gender: this.updateDoctorProfileForm.value.gender,
      phoneNumber: this.updateDoctorProfileForm.value.phoneNumber,
      specificAddress: this.updateDoctorProfileForm.value.specificAddress,
      wardId: this.wardId,
      describeExperiences:
        this.updateDoctorProfileForm.value.describeExperiences,
      workSchedules: this.workSchedules,
    };
    this.doctorService.updateDoctorInformation(doctorProfileRequest).subscribe({
      next: (data) => {
        this.isSuccessful = true;
        this.successMessage = data.message;
        this.router.navigate(['/home']).then(() => window.location.reload());
      },
      error: (err) => {
        this.isFailed = true;
        this.errorMessage = err.error.message;
      },
    });
  }

  onChange(e: any) {
    if (e.target.value == '1') {
      this.gender = 1;
    }
    this.gender = 0;
  }
}
