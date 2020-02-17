module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'fastfoot',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAdd: true,
  },
};
