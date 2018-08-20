import test from 'ava';
import { parsePointFromStr } from '../three/string-util';

test('parsePointFromStr', (t) => {
    t.true(parsePointFromStr('') === null);
    t.true(true);
});
