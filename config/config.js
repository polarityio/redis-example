module.exports = {
  /**
   * Name of the integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @required
   */
  name: 'Redis Example',
  /**
   * The acronym that appears in the notification window when information from this integration
   * is displayed.  Note that the acronym is included as part of each "tag" in the summary information
   * for the integration.  As a result, it is best to keep it to 4 or less characters.  The casing used
   * here will be carried forward into the notification window.
   *
   * @type String
   * @required
   */
  acronym: 'RED',
  defaultColor: 'light-blue',
  logging: { level: 'info' },
  entityTypes: ['IPv4'],
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: '',
    rejectUnauthorized: true
  },
  /**
   * Description for this integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @optional
   */
  description: 'This is a sample integration that connects to a Redis instance',
  /**
   * An array of style files (css or less) that will be included for your integration. Any styles specified in
   * the below files can be used in your custom template.
   *
   * @type Array
   * @optional
   */
  styles: ['./styles/redis-server.less'],
  /**
   * Provide custom component logic and template for rendering the integration details block.  If you do not
   * provide a custom template and/or component then the integration will display data as a table of key value
   * pairs.
   *
   * @type Object
   * @optional
   */
  block: {
    component: {
      file: './components/redis-server.js'
    },
    template: {
      file: './templates/redis-server.hbs'
    }
  },
  /**
   * Options that are displayed to the user/admin in the Polarity integration user-interface.  Should be structured
   * as an array of option objects.
   *
   * @type Array
   * @optional
   */
  options: [
    {
      key: 'host',
      name: 'Database Host',
      description: 'The hostname of the server hosting your Redis instance',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'port',
      name: 'Database Port',
      description: 'The port your redis instance is listening on',
      default: '6379',
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'database',
      name: 'Database Id',
      description: 'The redis database you are connecting to',
      default: '0',
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
