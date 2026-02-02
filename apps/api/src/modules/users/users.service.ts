import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsersRepository } from './users.repository';

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  passwordHash?: string;
  provider?: string;
  providerId?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findByProviderAndProviderId(provider: string, providerId: string) {
    return this.usersRepository.findByProviderAndProviderId(
      provider,
      providerId
    );
  }

  async create(data: CreateUserData) {
    let passwordHash = data.passwordHash;

    if (data.password && !passwordHash) {
      passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    }

    return this.usersRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      provider: data.provider ?? 'local',
      providerId: data.providerId,
      avatarUrl: data.avatarUrl,
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id: string, data: Partial<CreateUserData>) {
    const updateData: Record<string, string> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }

    const user = await this.usersRepository.update(id, updateData);

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  sanitizeUser(user: Awaited<ReturnType<typeof this.findById>>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
