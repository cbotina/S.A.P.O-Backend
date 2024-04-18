import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('SUBJECTS_MICROSERVICE') private client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  getAllSubject() {
    const pattern = 'findAllSubjects';
    const payload = [1, 2, 3];
    return this.client.send(pattern, payload);
  }

  sendMessage(pattern: string, payload?: any) {
    return this.client.send(pattern, payload);
  }
}
