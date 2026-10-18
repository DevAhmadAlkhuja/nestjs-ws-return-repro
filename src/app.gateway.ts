import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ path: '/ws' })
export class AppGateway {
  @SubscribeMessage('plain')
  plain(@MessageBody() data: unknown): unknown {
    return data;
  }

  @SubscribeMessage('wrapped')
  wrapped(@MessageBody() data: unknown) {
    return { event: 'reply', data };
  }
}
