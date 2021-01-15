import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState('');
  const [rawData, setRawData] = useState('');
  const [keyData, setKeyData] = useState({});
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [formattedData, setFormattedData] = useState('');

  useEffect(() => {
    setRawData(formData);
  }, [formData])

  useEffect(() => {
    if (!rawData) { return; }
    const newIndex = rawData.indexOf('.') + 1;
    const firstSentence = rawData.slice(0, newIndex - 1);
    setCurrentIndex(newIndex);
    setCurrentText(firstSentence);
  }, [rawData]);

  const prettyPrint = () => {
    const sortedData = Object.entries(keyData).sort((a, b) => b[1] - a[1]);
    const prettyData = sortedData.map(([key, count]) => (
      <>
        <span style={{fontWeight: 'bold'}}>
          {count > 1 && `(${count})`} {key.slice(0, key.indexOf(' ')).trim()}
        </span>
        &nbsp;{key.slice(key.indexOf(' ')).trim()}.
      </>
      ));
    return prettyData;
  };

  const advanceCurrent = () => {
    const newIndex = rawData.slice(currentIndex).indexOf('.') + currentIndex + 1;
    const nextSentence = rawData.slice(currentIndex, newIndex - 1);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
    setCurrentText(nextSentence);
  };

  const combine = () => {
    const newIndex = rawData.slice(currentIndex).indexOf('.') + currentIndex + 1;
    const nextSentence = rawData.slice(previousIndex, newIndex - 1);
    setCurrentIndex(newIndex);
    setCurrentText(nextSentence);
  };

  const newEntry = () => {
    setKeyData({ ...keyData, [currentText.trim()]: 1 });
    advanceCurrent();
  };

  const incrementKey = (key) => {
    const oldCount = keyData[key];
    setKeyData({ ...keyData, [key]: oldCount + 1 });
    advanceCurrent();
  };

  return (
    <div className="App">
      HR Tools
      <div>
        <input type="text" value={rawData} onChange={(event) => setFormData(event.target.value)} />
      </div>
      <div>
        {currentText}
      </div>
      <div>
        <button onClick={advanceCurrent}>Next/Ignore</button>
      </div>
      <div>
        <button onClick={newEntry}>New Entry</button>
      </div>
      <div>
        <button onClick={combine}>Combine</button>
      </div>
      &nbsp;
      <div>
        {Object.entries(keyData).map(([key, count]) => <div>{count}: <button onClick={() => incrementKey(key)}>{key}</button></div>)}
      </div>
      &nbsp;
      {prettyPrint()}
    </div>
  );
}

export default App;
