# Simple Timer / Metronome

```typescript
import Timer from '@gibme/timer';

const timer = new Timer(60_000);

timer.on('tick', () => {
   // do something 
});

timer.start();
```
