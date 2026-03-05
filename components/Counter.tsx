'use client'
import { useCounterStore } from "./providers/counter-provider";
import { Button } from "./ui/button";

export default function Counter() {
  const { count, incrementCount, decrementCount , addBy} = useCounterStore(
    (state) => state
  );
  return (
    <div>
      Count: {count}
      <Button variant={"outline"} onClick={incrementCount}>
        Increment
      </Button>
      <Button variant={"outline"} onClick={decrementCount}>
        Decrement
      </Button>
      <Button variant={"outline"} onClick={() => addBy(5)}>
        Add more 5
      </Button>
    </div>
  );
}
