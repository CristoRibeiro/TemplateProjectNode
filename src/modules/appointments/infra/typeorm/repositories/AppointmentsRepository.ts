import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAppointmentCreateDTO from '@modules/appointments/dtos/IAppointmentCreateDTO';
import Appointment from '../entities/appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private repositoryOrm: Repository<Appointment>;

  constructor() {
    this.repositoryOrm = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentByDate = await this.repositoryOrm.findOne({
      where: { date },
    });

    return appointmentByDate;
  }

  public async create({
    provider_id,
    date,
  }: IAppointmentCreateDTO): Promise<Appointment> {
    const appointment = this.repositoryOrm.create({
      provider_id,
      date,
    });
    await this.repositoryOrm.save(appointment);
    return appointment;
  }
}
export default AppointmentsRepository;
