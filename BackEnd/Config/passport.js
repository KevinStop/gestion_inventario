const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const getConnection = require('../conexion');

// Configuración de estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      getConnection((err, connection) => {
        if (err) return done(err);

        const sqlCheckUser = 'SELECT * FROM users WHERE google_id = ?';
        connection.query(sqlCheckUser, [profile.id], (error, results) => {
          if (error) return done(error);

          if (results.length > 0) {
            // Si el usuario existe, finalizar la autenticación
            connection.release();
            return done(null, results[0]);
          } else {
            // Si el usuario no existe, registrarlo
            const sqlInsertUser = 'INSERT INTO users (google_id, name, email, role, is_active) VALUES (?, ?, ?, ?, ?)';
            const newUser = [profile.id, profile.displayName, profile.emails[0].value, 'user', true];
            connection.query(sqlInsertUser, newUser, (err, result) => {
              connection.release();
              if (err) return done(err);
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

passport.deserializeUser((id, done) => {
  getConnection((err, connection) => {
    if (err) return done(err);

    const sql = 'SELECT * FROM users WHERE google_id = ?';
    connection.query(sql, [id], (err, results) => {
      connection.release();
      if (err) return done(err);
      done(null, results[0]);
    });
  });
});
