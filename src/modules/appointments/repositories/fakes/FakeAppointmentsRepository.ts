import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAppointmentCreateDTO from '@modules/appointments/dtos/IAppointmentCreateDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentByDate = this.appointments.find(appointment => {
      return isEqual(appointment.date, date);
    });

    return appointmentByDate;
  }

  public async create({
    provider_id,
    date,
  }: IAppointmentCreateDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id });
    this.appointments.push(appointment);
    return appointment;
  }

  public findAll(): Array<Appointment> {
    return this.appointments;
  }
}
export default AppointmentsRepository;
