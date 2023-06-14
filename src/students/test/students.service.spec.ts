import { Student } from '../students.model';
import { StudentsService } from '../students.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
  return {
    config: {
      update: jest.fn(),
    },
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        scan: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({ Items: [] }),
        }),
        get: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({ Item: {} }),
        }),
        put: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
        update: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
        delete: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
      })),
    },
  };
});

describe('StudentsService', () => {
  let service: StudentsService;
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    service = new StudentsService(documentClient);
  });

  // Prueba findAll
  it('findAll should return an array of students', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  // Prueba findOne
  it('findOne should return a student', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual({});
  });

  // Prueba create
  it('create should not throw', async () => {
    const student: Student = {
      id: '1',
      name: 'John',
      age: 20,
      grade: 12,
    };
    await expect(service.create(student)).resolves.not.toThrow();
  });

  // Prueba update
  it('update should not throw', async () => {
    const student: Student = {
      id: '1',
      name: 'John',
      age: 20,
      grade: 12,
    };
    await expect(service.update(student.id, student)).resolves.not.toThrow();
  });

  // Prueba delete
  it('delete should not throw', async () => {
    await expect(service.delete('1')).resolves.not.toThrow();
  });

  // Prueba que se lanza una excepción cuando no se encuentra un estudiante
  it('should throw NotFoundException when student not found', async () => {
    const getMock = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });
    documentClient.get = getMock;

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // Prueba que se lanza una excepción cuando el ID de la ruta y el del cuerpo no coinciden
  it('should throw BadRequestException when id in path and body do not match', async () => {
    const updateMock = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });
    documentClient.update = updateMock;

    const student = new Student();
    student.id = '2';
    student.name = 'Jane';
    student.age = 17;
    student.grade = 11;

    await expect(service.update('1', student)).rejects.toThrow(
      BadRequestException,
    );
  });
});
