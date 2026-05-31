import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { findOrCreateGoogleUser } from '../services/auth-service.js';

export function createGoogleStrategy() {
  return new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0];
        if (!email?.value) {
          return done(new Error('Google profile did not include email'));
        }

        const user = await findOrCreateGoogleUser({
          googleSub: profile.id,
          email: email.value,
          emailVerified: email.verified === true,
          name: profile.displayName || email.value,
          avatarUrl: profile.photos?.[0]?.value,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  );
}
