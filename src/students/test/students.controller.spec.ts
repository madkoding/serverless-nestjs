import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../students.controller';
import { StudentsService } from '../students.service';
import { Student } from '../students.model';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new Student()),
            create: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('findAll should return an array of students', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne should return a student', async () => {
    const result: Student = new Student();
    expect(await controller.findOne('1')).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('create should not throw', async () => {
    const student: Student = new Student();
    await expect(controller.create(student)).resolves.not.toThrow();
    expect(service.create).toHaveBeenCalledWith(student);
  });

  it('update should not throw', async () => {
    const student: Student = new Student();
    await expect(controller.update('1', student)).resolves.not.toThrow();
    expect(service.update).toHaveBeenCalledWith('1', student);
  });

  it('delete should not throw', async () => {
    await expect(controller.delete('1')).resolves.not.toThrow();
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
