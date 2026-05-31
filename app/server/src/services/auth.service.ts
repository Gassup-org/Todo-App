import { userRepository } from '../repositories/user.repository';
import { googleAuthService } from './google-auth.service';
import { tokenService } from './token.service';

export const authService = {
  getGoogleLoginUrl() {
    return googleAuthService.getAuthUrl();
  },

  async loginWithGoogleCode(code: string) {
    const profile = await googleAuthService.exchangeCode(code);
    const user = await userRepository.upsertGoogleUser(profile);

    if (!user.isActive) {
      throw new Error('User account is disabled');
    }

    const token = tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return { token, user };
  },

  async getCurrentUser(userId: string) {
    return userRepository.findById(userId);
  }
};
