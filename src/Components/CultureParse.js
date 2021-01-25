import React, { useEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';

const CultureParse = () => {
  const [formData, setFormData] = useState('');
  const [rawData, setRawData] = useState('');
  const [keyData, setKeyData] = useState({});
  const [currentText, setCurrentText] = useState('');
  const [textToSave, setTextToSave] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [startingNumber, setStartingNumber] = useState(1);

  useEffect(() => {
    setRawData(formData);
  }, [formData])

  useEffect(() => {
    if (!rawData) { return; }
    const newIndex = rawData.indexOf('.') + 1;
    const firstSentence = rawData.slice(0, newIndex - 1);
    setCurrentIndex(newIndex);
    setCurrentText(firstSentence);
    setTextToSave(firstSentence);
  }, [rawData]);

  const prettyPrint = () => {
    const sortedData = Object.entries(keyData).sort((a, b) => b[1] - a[1]);
    const prettyData = sortedData.map(([key, count]) => (
      <>
        <span style={{fontWeight: 'bold'}}>
          {count > 1 && ` (${count})`} {key.slice(0, key.indexOf(' ')).trim()}
        </span>
        &nbsp;{key.slice(key.indexOf(' ')).trim()}.
      </>
      ));
    return prettyData;
  };

  const advanceCurrent = () => {
    const newIndex = rawData.slice(currentIndex).indexOf('.') + currentIndex + 1;
    const nextSentence = rawData.slice(currentIndex, newIndex - 1);
    const [startParen, endParen] = [nextSentence.indexOf('('), nextSentence.indexOf(')')];
    let maybeNumber;
    if (startParen > 0 && endParen > 0) {
      const parenContent = nextSentence.substring(startParen + 1, endParen);
      maybeNumber = parseInt(parenContent, 10);
      if (maybeNumber) {
        setStartingNumber(maybeNumber);
      }
    }
    setStartingNumber(maybeNumber ? maybeNumber : 1);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
    setCurrentText(nextSentence);
    setTextToSave(nextSentence);
  };

  const combine = () => {
    const newIndex = rawData.slice(currentIndex).indexOf('.') + currentIndex + 1;
    const nextSentence = rawData.slice(previousIndex, newIndex - 1);
    setCurrentIndex(newIndex);
    setCurrentText(nextSentence);
    setTextToSave(nextSentence);
  };

  const newEntry = () => {
    setKeyData({ ...keyData, [textToSave.trim()]: startingNumber });
    advanceCurrent();
  };

  const incrementKey = (key) => {
    const oldCount = keyData[key];
    setKeyData({ ...keyData, [key]: oldCount + 1 });
    advanceCurrent();
  };

  return (
    <div className="App">
      Enter text to be parsed below:
      <div>
        <textarea type="text" value={rawData} onChange={(event) => setFormData(event.target.value)} rows="4" cols="50" />
      </div>
      &nbsp;
      <div>
        <AutosizeInput type="text" value={textToSave} onChange={(event) => setTextToSave(event.target.value)} />&nbsp;
      </div>
      <div>
        <input type="number" style={{ width: 50 }} value={startingNumber} onChange={(event) => setStartingNumber(parseInt(event.target.value, 10))} />
      </div>
      <div>
        <button onClick={advanceCurrent}>Next/Ignore</button>&nbsp;
        <button onClick={newEntry}>New Entry</button>&nbsp;
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

export default CultureParse;
