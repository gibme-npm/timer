// Copyright (c) 2016-2021 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import { EventEmitter } from 'events';

export default class Timer extends EventEmitter {
    public paused = true;
    private _timer?: NodeJS.Timeout;

    /**
     * Constructs a new instance of the timer
     *
     * Note: If additional arguments are specified, then those arguments will be
     * provided with every tick event emitted except arguments that may be included
     * with calls to the `tick()` method.
     *
     * @param interval
     * @param autoStart
     * @param args
     */
    constructor (public interval: number, autoStart = false, ...args: any[]) {
        super();

        if (autoStart) {
            this.paused = false;
        }

        const tick = (): void => {
            if (!this.paused) {
                this.tick(...args);
            }
            if (!this._destroyed) {
                this._timer = setTimeout(tick, this.interval);
            }
        };

        tick();
    }

    private _destroyed = false;

    /**
     * Returns if the timer has been destroyed
     */
    public get destroyed (): boolean {
        return this._destroyed;
    }

    /**
     * Event that is emitted every time a tick occurs
     * @param event
     * @param listener
     */
    public on(
        event: 'tick', listener: (...args: any[]) => void): this;

    /** @ignore */
    public on (
        event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Event that is emitted only once when a tick occurs
     *
     * @param event
     * @param listener
     */
    public once(event: 'tick', listener: (...args: any[]) => void): this;

    /** @ignore */
    public once (
        event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Destroys the timer
     */
    public destroy (): void {
        this._destroyed = true;

        if (this._timer) {
            clearTimeout(this._timer);
        }

        delete this._timer;
    }

    /**
     * Starts the timer
     */
    public start (): void {
        this.paused = false;
    }

    /**
     * Stops the timer
     */
    public stop (): void {
        this.paused = true;
    }

    /**
     * Forces a tick event to be emitted with the specified arguments
     *
     * @param args
     */
    public tick (...args: any[]): void {
        this.emit('tick', ...args);
    }

    /**
     * Toggles the timer on/off
     */
    public toggle (): boolean {
        this.paused = (!this.paused);

        return this.paused;
    }
}
