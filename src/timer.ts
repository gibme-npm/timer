// Copyright (c) 2016-2023, Brandon Lehmann <brandonlehmann@gmail.com>
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

export default class Timer<Type = any> extends EventEmitter {
    public paused = true;
    private _timer?: NodeJS.Timeout;
    private readonly _args: any[];

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

        this._args = args;

        if (autoStart) {
            this.start();
        }
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
    public on(event: 'tick', listener: (...args: any[]) => void): this;

    /**
     * Event that is emitted when we have an error
     *
     * @param event
     * @param listener
     */
    public on(event: 'error', listener: (error: Error) => void): this;

    /**
     * Event that is emitted when we start the timer
     *
     * @param event
     * @param listener
     */
    public on(event: 'start', listener: () => void): this;

    /**
     * Event that is emitted when we stop the timer
     *
     * @param event
     * @param listener
     */
    public on(event: 'stop', listener: () => void): this;

    /** @ignore */
    public on(event: 'data', listener: (payload: Type, timestamp: number, interval: number) => void): this;

    /** @ignore */
    public on (
        event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Event that is emitted only once when we start the timer
     *
     * @param event
     * @param listener
     */
    public once(event: 'start', listener: () => void): this;

    /**
     * Event that is emitted only once when we stop the timer
     *
     * @param event
     * @param listener
     */
    public once(event: 'stop', listener: () => void): this;

    /**
     * Event that is emitted only once when a tick occurs
     *
     * @param event
     * @param listener
     */
    public once(event: 'tick', listener: (...args: any[]) => void): this;

    /** @ignore */
    public once(event: 'data', listener: (payload: Type, timestamp: number, interval: number) => void): this;

    /**
     * Event that is emitted only once when we have an error
     *
     * @param event
     * @param listener
     */
    public once(event: 'error', listener: (error: Error) => void): this;

    /** @ignore */
    public once (
        event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Event that is emitted only once when we start the timer
     *
     * @param event
     * @param listener
     */
    public off(event: 'start', listener: () => void): this;

    /**
     * Event that is emitted only once when we stop the timer
     *
     * @param event
     * @param listener
     */
    public off(event: 'stop', listener: () => void): this;

    /**
     * Event that is emitted only once when a tick occurs
     *
     * @param event
     * @param listener
     */
    public off(event: 'tick', listener: (...args: any[]) => void): this;

    /** @ignore */
    public off(event: 'data', listener: (payload: Type, timestamp: number, interval: number) => void): this;

    /**
     * Event that is emitted only once when we have an error
     *
     * @param event
     * @param listener
     */
    public off(event: 'error', listener: (error: Error) => void): this;

    /** @ignore */
    public off (
        event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Destroys the timer
     *
     * Note: This is destructive, once destroyed, it cannot be restarted
     */
    public destroy (): void {
        this.stop();

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
        if (this.paused && !this._destroyed) {
            this.paused = false;

            this._tick();

            this.emit('start');
        }
    }

    /**
     * Stops the timer
     */
    public stop (): void {
        if (!this.paused && !this.destroyed) {
            this.paused = true;

            this.emit('stop');
        }
    }

    /**
     * Forces a tick event to be emitted with the specified arguments
     *
     * @param args
     */
    public tick (...args: any[]): void {
        if (this.destroyed) return;

        this.emit('tick', ...args);
    }

    /**
     * Toggles the timer on/off
     *
     * @returns boolean whether the timer is running or not
     */
    public toggle (): boolean {
        if (this.destroyed) return false;

        if (this.paused) {
            this.start();
        } else {
            this.stop();
        }

        return !this.paused;
    }

    private _tick = (): void => {
        if (!this.paused) {
            try {
                this.tick(...this._args);
            } catch (error: any) {
                this.emit('error', error instanceof Error ? error : new Error(error.toString()));
            }
        }
        if (!this._destroyed) {
            this._timer = setTimeout(this._tick, this.interval);
        }
    };
}

/**
 * A helper class that performs a sync function at the given interval
 * and emits the result on a regular basis
 */
export class SyncTimer<Type = any> extends Timer<Type> {
    public constructor (func: () => Type, interval: number, autostart = false) {
        super(interval);

        this.on('tick', () => {
            try {
                const now = Math.round((new Date()).getTime() / 1000);

                // go get the results
                const result = func();

                // emit the results
                this.emit('data', result, now, interval);
            } catch (error: any) {
                this.emit('error', error instanceof Error ? error : new Error(error.toString()));
            }
        });

        this.on('error', () => {}); // swallow the error by default

        if (autostart) this.start();
    }
}

/**
 * A helper class that performs an async function at the given interval
 * and emits the result on a regular basis
 */
export class AsyncTimer<Type = any> extends Timer<Type> {
    public constructor (func: () => Promise<Type>, interval: number, autostart = false) {
        super(interval);

        this.on('tick', async () => {
            try {
                const now = Math.round((new Date()).getTime() / 1000);

                // go get the results
                const result = await func();

                // emit the results
                this.emit('data', result, now, interval);
            } catch (error: any) {
                this.emit('error', error instanceof Error ? error : new Error(error.toString()));
            }
        });

        this.on('error', () => {}); // swallow the error by default

        if (autostart) this.start();
    }
}

export { Timer };
