const guildModel = require('../models/guild.js');
const { pannel } = require('./functions.js');

module.exports = async (client, message) => {
    const guildData = await guildModel.findOne({ guildId: message.guild.id });
    if (message.channel.id !== guildData?.channelId) return;
    const cnl = await message.guild.channels.cache.get(guildData?.channelId);
    try {
        await cnl?.messages.fetch(guildData?.messageId);
    } catch (error) {
        let msgg = await cnl?.send(pannel(client));
        guildData.messageId = msgg?.id;
        guildData.save();
    };

    let channel = message.member.voice?.channel;

    if (!channel) return message.reply({
        embeds: [{
            color: client.color.error,
            description: 'You must be in a voice channel to play something'
        }]
    }).then((i) => setTimeout(() => {
        if (i) i?.delete();
        if (message) message?.delete();
    }, 5 * 1000));

    if (!message.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) return message.reply({
        embeds: [{
            color: client.color.error,
            description: 'I need `CONNECT` and `SPEAK` permission in `' + channel.name + '`'
        }]
    }).then((i) => setTimeout(() => {
        if (i) i?.delete();
        if (message) message?.delete();
    }, 5 * 1000));

    if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.reply({
        embeds: [{
            color: client.color.error,
            description: 'You must be in the same voice channel as me to use this command'
        }]
    }).then((i) => setTimeout(() => {
        if (i) i?.delete();
        if (message) message?.delete();
    }, 5 * 1000));

    let search = message.content;
    if (!search) return message.reply({
        embeds: [{
            color: client.color.error,
            description: `Usage - \`${client.prefix}play <song name or url | playlist url>\``
        }]
    }).then((i) => setTimeout(() => {
        if (i) i?.delete();
        if (message) message?.delete();
    }, 5 * 1000));

    var player = await client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
        volume: 80
    });

    try {
        if (player.state != "CONNECTED") await player.connect();
    } catch (error) {
        return message.reply({
            embeds: [{
                color: client.color.error,
                description: `Unable to connect the player`
            }]
        }).then((i) => setTimeout(() => {
            if (i) i?.delete();
            if (message) message?.delete();
        }, 5 * 1000));
    }

    let res;
    try {
        res = await player.search(search, message.author);
    } catch (error) {
        return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'there was an error while searching'
            }]
        }).then((i) => setTimeout(() => {
            if (i) i?.delete();
            if (message) message?.delete();
        }, 5 * 1000));
    };

    switch (res.loadType) {
        case "LOAD_FAILED":
            if (!player.queue.current) player.destroy();
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: 'Unable to load the track'
                }]
            }).then((i) => setTimeout(() => {
                if (i) i?.delete();
                if (message) message?.delete();
            }, 5 * 1000));
        case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: `No matches found for - ${search}`
                }]
            }).then((i) => setTimeout(() => {
                if (i) i?.delete();
                if (message) message?.delete();
            }, 5 * 1000));
        case "TRACK_LOADED":
            var track = res.tracks[0];
            player.queue.add(track);
            if (message) message.delete();
            if (!player.playing && !player.paused && !player.queue.size) {
                player.play();
                return pannel(client, player);
            }
            return pannel(client, player);
        case 'PLAYLIST_LOADED':
            player.queue.add(res.tracks);
            if (message) message.delete();
            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) {
                player.play();
                return pannel(client, player);
            }
            return pannel(client, player);
        case 'SEARCH_RESULT':
            player.queue.add(res.tracks[0]);
            if (message) message.delete();
            if (!player.playing && !player.paused && !player.queue.size) {
                player.play();
                return pannel(client, player);
            }
            return pannel(client, player);
    };
};