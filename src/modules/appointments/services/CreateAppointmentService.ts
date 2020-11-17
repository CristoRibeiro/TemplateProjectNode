import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const dateAppointmentStart = startOfHour(date);

    const sameDateAppointments = await this.appointmentsRepository.findByDate(
      dateAppointmentStart,
    );

    if (sameDateAppointments) {
      throw new AppError('This Appointment is already booked! ', 409);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: dateAppointmentStart,
    });
    return appointment;
  }
}
export default CreateAppointmentService;
