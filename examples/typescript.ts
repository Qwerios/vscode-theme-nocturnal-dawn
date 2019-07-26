export class BufferedClient {

  /**
   * Creates an instance of BufferedClient
   *
   * @param {boolean} [waitForInitialConnection=true]
   * @param {boolean} [initialConnected=false]
   */
  constructor(
    private waitForInitialConnection = true,
    private initialConnected = false,
  ) {}

  /**
   * The internal buffer
   *
   * @private
   * @type {any[]}
   */
  private buffer: any[];

  /**
   * Indicates the client is active
   *
   * @private
   * @type {boolean}
   */
  private ticking: boolean = false;

  /**
   * Push an item into the buffer to publish it
   *
   * @param {string} subject
   * @param {string} data
   * @memberof NatsBufferedClient
   */
  public publish( subject: string, data: string ): number
  {
    // Don't allow publishing before initial connect if the client is
    // configured to do so
    //
    if ( this.waitForInitialConnection && !this.initialConnected ) {
      throw new Error( 'Tried to publish before initial connection' );
    }

    // Push onto the end of the buffer
    //
    this.buffer.push( { subject, data } );
    console.log( '[BUFFERED-CLIENT] Added message to buffer', subject, data );

    // Resume buffer processing if needed
    //
    this.tick();

    return this.buffer.length;
  }
}

