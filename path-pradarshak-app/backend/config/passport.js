const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Helper to handle social login logic
const handleSocialLogin = async (req, accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails, photos, provider } = profile;
        const email = emails && emails[0] ? emails[0].value : null;
        const avatar = photos && photos[0] ? photos[0].value : '';

        if (!email) {
            return done(new Error('No email found directly from social provider'), null);
        }

        // 1. Check if user exists by social ID
        let user = await User.findOne({ [`${provider}Id`]: id });

        if (user) {
            return done(null, user);
        }

        // 2. Check if user exists by email
        user = await User.findOne({ email });

        if (user) {
            // Link the social account to the existing user
            user[`${provider}Id`] = id;
            if (!user.avatar) user.avatar = avatar;
            await user.save();
            return done(null, user);
        }

        // 3. Create new user
        const newUser = new User({
            name: displayName || email.split('@')[0],
            email: email,
            [`${provider}Id`]: id,
            avatar: avatar,
            isVerified: true, // Social accounts are verified by default
            password: undefined // Explicitly undefined for social users
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
};

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'place_holder_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'place_holder_secret',
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
},
    handleSocialLogin
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'place_holder_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'place_holder_secret',
    callbackURL: "/api/auth/github/callback",
    passReqToCallback: true
},
    handleSocialLogin
));

module.exports = passport;
