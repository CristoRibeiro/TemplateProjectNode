import Appointment from '../infra/typeorm/entities/appointment';
import IAppointmentCreateDTO from '../dtos/IAppointmentCreateDTO';

export default interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  create(appointmentDTO: IAppointmentCreateDTO): Promise<Appointment>;
}
