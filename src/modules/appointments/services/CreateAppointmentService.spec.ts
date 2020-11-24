import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointmentService', () => {
  it('Should be able create a new appointment.', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const dateAppointment = new Date();
    const appointment = await createAppointmentService.execute({
      provider_id: '123123',
      date: dateAppointment,
    });

    expect(appointment.provider_id).toBe('123123');
    expect(appointment).toHaveProperty('id');
  });

  it('Should not be able create a new appointment on the same time.', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const dateAppointment = new Date();
    await createAppointmentService.execute({
      provider_id: '123123',
      date: dateAppointment,
    });

    expect(
      createAppointmentService.execute({
        provider_id: '123123',
        date: dateAppointment,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
