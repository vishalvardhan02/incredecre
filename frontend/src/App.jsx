import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'MySet':
      return { ...state, mycount: action.mycount };
    case 'MyIncrement':
      return { ...state, mycount: state.mycount + 1 };
    case 'MyDecrement':
      return { ...state, mycount: state.mycount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state,dispatch } = useContext(CounterContext);
  useEffect( ()=>{
    async function current(){
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({type:'MySet',mycount:response.data.mycount});
      dispatch({type:'SET',count:response.data.count});
    }
    current()
  }, [])
  
  return (
    <div>
      <h1>My Count: {state.mycount}</h1>
      <h1>Count:  {state.count}</h1>
      <Link to="/counter">Counter</Link>
    </div>
  );
};
const MyCounter=()=>{
  const {state,dispatch}=useContext(CounterContext);
  const navigate=useNavigate();
  const MyfetchCounter=useCallback(async ()=>{
    try{
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count });
      dispatch({type:'MySet',mycount:response.data.mycount});
    }
    catch(err){
      console.log(err);
    }
  },[dispatch]);
  
  useEffect(() => {
    MyfetchCounter();
  }, [MyfetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/increment');
      dispatch({ type: 'MyIncrement' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/decrement');
      dispatch({ type: 'MyDecrement' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>My Count: {state.mycount}</p>
      <p>Count:  {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();
  console.log(state.count, state.mycount)
  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count });
      dispatch({type:'MySet',mycount:response.data.mycount});
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  function getMy(){
    return [localStorage.getItem("mycount"), localStorage.getItem("count")]
  }
  return (
    <div>
      <h2>Counter</h2>
      <p>My Count: {state.mycount}</p>
      <p>Count:  {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 ,mycount:0});

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter/>}/>
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;