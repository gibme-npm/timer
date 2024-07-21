// Copyright (c) 2016-2021 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

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
