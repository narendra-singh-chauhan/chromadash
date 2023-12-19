// imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faPlay, faStop, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import axios from 'axios';

// constatns
const INTERVAL = 250;
const STATUS = 'stop';
const VITE_APP_API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const App = () => {
  const [grids, setGrids] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(INTERVAL);
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState<string>(STATUS);

  const fetchGrids = async () => {
    try {
      const baseUrl = `${VITE_APP_API_BASE_URL}/grids`;
      const response = await axios(baseUrl);
      if (response.data.success) {
        setGrids(response.data?.grids);
      }
      console.log('grids response: ', response.data);
    } catch (error) {
      console.error('Error while fetching grids: ', error);
    }
  };

  useEffect(() => {
    fetchGrids();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status === 'start') {
        fetchGrids();
      }
    }, speed);

    if (status !== 'start') {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId);
  }, [speed, status]);

  const onStart = () => {
    setScore(0);
    setStatus('start')
  }

  const onSelected = async (grid: string, index: number) => {
    if (status !== 'start' || !['red', 'blue'].includes(grid)) return;

    const gridItems = document.querySelectorAll('.grid-item');
    gridItems[index].classList.add('flip');

    // Simulate the flipping animation for 3 times
    setTimeout(() => {
      gridItems[index].classList.remove('flip');
    }, 1500);

    try {
      const baseUrl = `${VITE_APP_API_BASE_URL}/select?grid=${grid}&score=${score}`;
      const response = await axios(baseUrl);
      if (response.data.success) {
        setScore(response.data?.score);
      }
      console.log('score response: ', response.data);
    } catch (error) {
      console.error('Error while selecting the option: ', error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="heading">
          ChromaDash: Colorful Tile Challenge
        </div>
        <div className="score">
          <h6>Score : {score}</h6>
        </div>

        <div className="grid-box">
          <div className="grid-container">
            {grids.map((grid, indx) => (
              <div
                className="grid-item"
                key={indx}
                style={{ backgroundColor: grid }}
                onClick={() => onSelected(grid, indx)}
              />
            ))}
          </div>
        </div>

        <div className="controlls">
          <div className="speed-controller">
            <button
              className="btn bg-white sm-btn"
              onClick={() => setSpeed(prev => prev - INTERVAL)}
              disabled={speed === INTERVAL}
              style={{ opacity: speed === INTERVAL ? 0.5 : 1 }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <button className="btn bg-white sm-btn">
              Speed: {speed / INTERVAL}
            </button>
            <button
              className="btn bg-white sm-btn"
              onClick={() => setSpeed(prev => prev + INTERVAL)}
              disabled={speed === (INTERVAL * 5)}
              style={{ opacity: speed === (INTERVAL * 5) ? 0.5 : 1 }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button className="btn bg-green" onClick={onStart}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button className="btn bg-red" onClick={() => setStatus('stop')}>
            <FontAwesomeIcon icon={faStop} />
          </button>

          <button className="btn bg-orange" onClick={() => setStatus('start')}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;