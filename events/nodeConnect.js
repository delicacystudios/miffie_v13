module.exports = {
    name: 'nodeConnect',
    run: async (client, node) => {
        console.log(`Node connected : ${node.options.identifier}`);
    }
};