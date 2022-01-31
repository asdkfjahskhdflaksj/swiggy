//third party module
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const JwtExtract = require("passport-jwt").ExtractJwt;

//doveloper moduel
const User = require("../model/user-model");

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ email })
    .then((user) => done(null, user))
    .catch(done);
});

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
      session: false,
    },
    async (req, username, password, done) => {
      try {
        let user = await User.findOne({
          $or: [{ email: username }, { username }],
        });
        if (user)
          return done(null, false, {
            message: "username or password are already taken",
          });
        user = await User.create({
          username,
          email: req.body.email,
          password,
          confirmPassword: req.body.confirmPassword,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
      session: false,
    },
    async (req, username, password, done) => {
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      }).select("+password");
      if (!user || !(await user.verifyPassword(password, user.password)))
        return done(null, false, {
          message: "please enter a valid username or password",
        });
      done(null, user);
    }
  )
);

passport.use(
  "protect",
  new JwtStrategy(
    {
      jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRETE,
      session: false,
    },
    async (payload, done) => {
      const user = await User.findOne({ email: payload.email });
      if (!user) return done(null, false, { message: "user no longer exists" });
      if (user.isPasswordChangedAfter())
        return done(null, false, { message: "your not authorized " });
      done(null, user);
    }
  )
);

passport.use(
  "loginsession",
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("i did run");
      const user = await User.findOne({
        $or: [{ email: username }, { username }],
      }).select("+password");
      if (!user || !(await user.verifyPassword(password, user.password)))
        return done(null, false, {
          message: "please enter a valid username or password",
        });
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

//authentication is passport:

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      profile.email = "sachinkshetty41@gmail.com";
      done(null, profile);
    }
  )
);
