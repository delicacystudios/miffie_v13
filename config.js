module.exports = {
    token: process.env.CLIENT_TOKEN || process.env['TOKEN'],
    clientId: process.env.CLIENT_ID || "922614106333249557",
    clientSecret: process.env.CLIENT_SECRET || process.env['ClientSecret'],
    callBackURL: process.env.DISCORD_CALLBACK_URL || "https://miffie_v13.delicacysound.repl.co",
    db: process.env.DB || process.env['DB'],
    prefix: process.env.PREFIX || "m/",
    port: process.env.PORT || 3001,
    production: process.env.PRODUCTION ? true : false,
    dashboardURL: process.env.DASHBOARD_URL || 'https://miffie_v13.delicacysound.repl.co/dashboard',
    color: {
        default: '00FFFF',
        error: 'RED'
    },
    lavalink: {
        id: 'Main',
        host: process.env.LAVALINK_HOST || 'lava.link',
        port: parseInt(process.env.LAVALINK_PORT) || 80,
        password: process.env.LAVALINK_PASSWORD || 'youshallnotpass'
    },
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID || process.env['SClient'],
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || process.env['SToken'],
};