// Copyright (c) 2016-2022, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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

export { Timer };
