// Copyright (c) 2016-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import { ExtendedTimer } from './extended_timer';

/**
 * A helper class that performs an async function at the given interval
 * and emits the result on a regular basis
 */
export class AsyncTimer<Type = any> extends ExtendedTimer<Type> {
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

    /** @ignore */
    public on (event: 'data', listener: (payload: Type, timestamp: number, interval: number) => void): this;
    public on (event: any, listener: (...args: any[]) => void): this;
    /** @ignore */
    public on (event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
