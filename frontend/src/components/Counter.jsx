import { useEffect } from "react";

function Counter () {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((counter) => counter + 1);
  };

  /*UseEffect takes a callback function, dependencies array*/
    useEffect(() => {
    setCounter(5);
  }, []) // Only runs once

  useEffect(() => {
    console.log(`The counter is: ${counter}`)
  }, [counter]) // Calls the function every time the value changes


  return (
    <div className='App'>
      <button onClick={handleClick}>Increment</button>
      The current value is: {counter}
    </div>
  );
};
export default Counter;