module.exports = function (RED) {
    /**
     *
     * @param {*} config
     */
    function UIGroupNode (config) {
        RED.nodes.createNode(this, config)
        const node = this

        if (!('showTitle' in config)) {
            // migration backwards compatibility
            // we now use showTitle, not disp, but older flows still may have disp
            config.showTitle = config.disp || true
        }

        node.on('close', function (removed, done) {
            node.deregister() // deregister self
            done()
        })

        /**
         * Function for widgets to register themselves with this page
         * Calls the parent UI Base "register" function and registers this page,
         * along with the widget
         * @param {*} widget
         */
        node.register = function (widgetNode, widgetConfig, widgetEvents) {
            const page = RED.nodes.getNode(config.page)
            const group = config
            page.register(group, widgetNode, widgetConfig, widgetEvents)
        }

        node.deregister = function (widgetNode) {
            const page = RED.nodes.getNode(config.page)
            const group = config
            page.deregister(group, widgetNode)
        }

        // Return the UI Base Node this group lives in
        node.getBase = function () {
            return RED.nodes.getNode(config.page).getBase()
        }
    }
    RED.nodes.registerType('ui-group', UIGroupNode)
}
