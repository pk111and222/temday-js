# Time zones

The root factory uses the host time zone. Create a context factory when a feature needs a fixed time zone.

```ts
import { createTemday } from 'temday/context';

const newYork = createTemday({ timeZone: 'America/New_York' });
const before = newYork('2024-03-10T01:30:00');

before.add(1, 'hour').format('YYYY-MM-DD HH:mm Z');
// 2024-03-10 03:30 -04:00
```

Each context owns its time zone and installed plugins, so it cannot change the root factory or another context.
