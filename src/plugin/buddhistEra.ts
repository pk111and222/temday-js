import type { Plugin } from '../types.js';
const buddhistEra: Plugin = (_option, Temday) => { const previous = Temday.prototype.format; Temday.prototype.format = function format(pattern = 'YYYY-MM-DDTHH:mm:ssZ') { return previous.call(this, pattern.replace(/\[([^\]]*)]|BBBB|BB/g, (match: string, literal: string | undefined) => literal === undefined ? `[${match === 'BBBB' ? this.year() + 543 : String((this.year() + 543) % 100).padStart(2, '0')}]` : match)); }; };
export default buddhistEra;
