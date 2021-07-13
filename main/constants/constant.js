module.exports = {
    PORT: 3000,
    DB: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/dzOkten',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ewrewfcdsvd',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'EFDVSDVSDWDFSDF',
    FORGOT_TOKEN: process.env.FORGOT_TOKEN || 'EFDVSDVSDWDFdvdvdfdfSDF',
    AUTHORIZATION: 'Authorization',
    TIME_ACCESS_TOKEN: '10m',
    TIME_REFRESH_TOKEN: '30d',
    ACCESS: 'access',
    REFRESH: 'refresh',
    EMAIL: process.env.EMAIL || 'ivankal@gmail.com',
    PASSWORD_EMAIL: process.env.PASSWORD_EMAIL || 'EWRWFEFD',
    ACTIVATE_TOKEN_SECRET: process.env.ACTIVATE_TOKEN_SECRET || 'efmefirfmemfregrgergrge'
};
