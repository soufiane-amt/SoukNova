import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  adminId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['polling', 'websocket'],
  // Remove namespace for simpler setup
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedAdmins = new Map<string, string>(); // adminId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('🚀 WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    console.log(`🔌 New connection attempt: ${client.id}`);
    this.logger.log(`🔌 Handshake headers:`, JSON.stringify(client.handshake.headers.cookie ? 'Has cookies' : 'No cookies'));
    
    try {
      // Extract token from cookies or authorization header
      const token = this.extractTokenFromSocket(client);
    this.logger.log(`🍪 Extracted token: ${token}`);
      if (!token) {
        this.logger.warn(`❌ No token found for client: ${client.id}`);
        client.emit('error', { message: 'No authentication token provided' });
        client.disconnect();
        return;
      }

      this.logger.log(`🔑 Token found for client: ${client.id}`);

      // Verify JWT token
      let payload;
      try {
        payload = this.jwtService.verify(token);
        this.logger.log(`✅ payload: ${JSON.stringify(payload)}`);
      } catch (jwtError) {
        this.logger.error(`❌ JWT verification failed for client: ${client.id}`, jwtError.message);
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
        return;
      }

      if (!payload.sub) {
        this.logger.warn(`❌ No adminId in token for client: ${client.id}`);
        client.emit('error', { message: 'Invalid token payload' });
        client.disconnect();
        return;
      }

      this.logger.log(`✅ Token verified for admin: ${payload.sub}`);

      // Verify admin exists in database
      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin) {
        this.logger.warn(`❌ Admin not found in database: ${payload.sub}`);
        client.emit('error', { message: 'Admin not found' });
        client.disconnect();
        return;
      }

      this.logger.log(`✅ Admin verified in database: ${payload.sub}`);

      // Store admin connection
      client.adminId = payload.sub;
      this.connectedAdmins.set(payload.sub, client.id);

      // Join admin to their personal room
      client.join(`admin:${payload.sub}`);

      this.logger.log(`✅ Admin ${payload.sub} connected successfully: ${client.id}`);

      // Send connection success
      client.emit('connected', { message: 'Connected to notifications' });

      // Send current unread count
      const unreadCount = await this.getUnreadCount(payload.sub);
      client.emit('unreadCount', unreadCount);
      
    } catch (error) {
      this.logger.error(`❌ Connection error for ${client.id}:`, error.message);
      client.emit('error', { message: 'Connection failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.adminId) {
      this.connectedAdmins.delete(client.adminId);
      this.logger.log(`👋 Admin ${client.adminId} disconnected: ${client.id}`);
    } else {
      this.logger.log(`👋 Unknown client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: Date.now() });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    if (client.adminId) {
      client.join(data.room);
      this.logger.log(`Admin ${client.adminId} joined room: ${data.room}`);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    if (client.adminId) {
      client.leave(data.room);
      this.logger.log(`Admin ${client.adminId} left room: ${data.room}`);
    }
  }

  // Method to emit notifications to specific admins
  async emitToAdmins(adminIds: string[], event: string, data: any) {
    for (const adminId of adminIds) {
      this.server.to(`admin:${adminId}`).emit(event, data);
      this.logger.log(`📤 Emitted ${event} to admin: ${adminId}`);
    }
  }

  // Method to emit to all connected admins
  emitToAllAdmins(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`📤 Emitted ${event} to all admins`);
  }

  // Method to get unread count for an admin
  private async getUnreadCount(adminId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { adminId, read: false },
    });
  }

  // Extract JWT token from socket connection
  private extractTokenFromSocket(client: Socket): string | null {
    // Try to get token from cookies
    const cookies = client.handshake.headers.cookie;
    this.logger.log(`🍪 Cookies header: ${cookies ? 'present' : 'missing'}`);
    
    if (cookies) {
      const tokenMatch = cookies.match(/jwt=([^;]+)/);
      if (tokenMatch) {
        this.logger.log(`🔑 Token found in cookies`);
        return tokenMatch[1];
      }
    }

    // Try to get token from auth object
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      this.logger.log(`🔑 Token found in auth object`);
      return authToken;
    }

    // Try to get token from authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      this.logger.log(`🔑 Token found in authorization header`);
      return authHeader.replace('Bearer ', '');
    }

    return null;
  }
}