import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MovieEntity } from './entities/movie.entity';

@WebSocketGateway()
export class MovieGateway {
  @WebSocketServer() server: Server;

  sendMovieUpdate(movie) {
    this.server.emit('movieRatingUpdated', movie);
  }
}
