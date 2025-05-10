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

import { describe, it } from 'mocha';
import Timer from '../src';

describe('Unit Tests', async () => {
    // const sleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

    it('Automatic Tick Event Handled', async () => {
        return new Promise(resolve => {
            const timer = new Timer(1000, false);

            timer.once('tick', () => {
                timer.destroy();

                return resolve();
            });

            timer.start();
        });
    });

    it('Manual Tick Event Handled', async () => {
        return new Promise(resolve => {
            const timer = new Timer(1000, false);

            timer.once('tick', () => {
                timer.destroy();

                return resolve();
            });

            timer.tick();
        });
    });

    it('Automatic Tick Event with Arguments Handled', async () => {
        const value = 99999;

        return new Promise((resolve, reject) => {
            const timer = new Timer(1000, false, value);

            timer.once('tick', (tickedValue: number) => {
                timer.destroy();

                if (tickedValue === value) {
                    return resolve();
                } else {
                    return reject(new Error('Wrong tick value received'));
                }
            });

            timer.start();
        });
    });

    it('Manual Tick Event with Arguments Handled', async () => {
        const value = 99999;

        return new Promise((resolve, reject) => {
            const timer = new Timer(1000, false);

            timer.once('tick', (tickedValue: number) => {
                timer.destroy();

                if (tickedValue === value) {
                    return resolve();
                } else {
                    return reject(new Error('Wrong tick value received'));
                }
            });

            timer.tick(value);
        });
    });

    it('Manual Tick Event with Different Tick Arguments Handled', async () => {
        const value = 99999;

        return new Promise((resolve, reject) => {
            const timer = new Timer(1000, false, 111111);

            timer.once('tick', (tickedValue: number) => {
                timer.destroy();

                if (tickedValue === value) {
                    return resolve();
                } else {
                    return reject(new Error('Wrong tick value received'));
                }
            });

            timer.tick(value);
        });
    });
});
