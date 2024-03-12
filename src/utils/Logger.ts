/** Logger.ts
 * Copyright (c) 2024, Towechlabs
 *
 * adapter for pino
 */
import pino, { Logger } from 'pino';

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
export const getLogger = (name: string): Logger => pino({ name, level });
// pino({ name, level, transport: { target: 'pino-pretty', options: { colorize: true } } });
