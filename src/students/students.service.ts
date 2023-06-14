import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Student } from './students.model';
import * as AWS from 'aws-sdk';

@Injectable()
export class StudentsService {
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor(dynamoDb: AWS.DynamoDB.DocumentClient) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.dynamoDb = dynamoDb;
    this.tableName = 'Students';
  }

  async findAll(): Promise<Student[]> {
    const result = await this.dynamoDb
      .scan({ TableName: this.tableName })
      .promise();
    return result.Items as Student[];
  }

  async findOne(id: string): Promise<Student> {
    const result = await this.dynamoDb
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return result.Item as Student;
  }

  async create(student: Student): Promise<void> {
    await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: student,
      })
      .promise();
  }

  async update(id: string, student: Student): Promise<void> {
    if (id !== student.id) {
      throw new BadRequestException(
        `Student id does not match with the params`,
      );
    }

    await this.dynamoDb
      .update({
        TableName: this.tableName,
        Key: { id },
        ExpressionAttributeNames: {
          '#studentName': 'name',
          '#studentAge': 'age',
          '#studentGrade': 'grade',
        },
        ExpressionAttributeValues: {
          ':name': student.name,
          ':age': student.age,
          ':grade': student.grade,
        },
        UpdateExpression:
          'SET #studentName = :name, #studentAge = :age, #studentGrade = :grade',
      })
      .promise();
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDb
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }
}
