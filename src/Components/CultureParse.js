import React, { useEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';

import { getItemFromLocalStorage, setItemInLocalStorage } from '../utils/localStorage';

const CultureParse = () => {
  const [sentences, setSentences] = useState([]);
  const [rawData, setRawData] = useState('');
  const [keyData, setKeyData] = useState({});
  const [textToSave, setTextToSave] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [occurencesFromString, setOccurencesFromString] = useState(1);
  const [newEntryDisabled, setNewEntryDisabled] = useState(false);

  useEffect(() => {
    try {
      const state = JSON.parse(getItemFromLocalStorage('state'));
      setSentences(state.sentences);
      setRawData(state.rawData);
      setKeyData(state.keyData);
      setTextToSave(state.textToSave);
      setCurrentIndex(state.currentIndex);
      setOccurencesFromString(state.occurencesFromString);
      setNewEntryDisabled(state.newEntryDisabled);
    } catch (err) {
      console.log(`No previous state found. ${err.message}`);
    }
  }, []);

  useEffect(() => {
    setItemInLocalStorage('state', JSON.stringify({
      sentences, rawData, keyData, textToSave, currentIndex, occurencesFromString, newEntryDisabled,
    }))
  }, [sentences, rawData, keyData, textToSave, currentIndex, occurencesFromString, newEntryDisabled]);

  const updateInput = (input) => {
    setRawData(input);
    const newSentences = input.split(/[.!?]/).map((sentence) => sentence.trim());
    setSentences(newSentences);
    handleSentenceChange(newSentences);
    setCurrentIndex(0);
  }

  const clear = () => {
    setRawData('');
    setSentences([]);
    setKeyData({});
    setTextToSave('');
    setCurrentIndex(0)
    setOccurencesFromString(1);
  };

  const handleSentenceChange = (newSentences) => {
    console.log(newSentences);
    if (!newSentences.length) { return; }
    const nextSentence = newSentences[0];
    const [startParen, endParen] = [nextSentence.indexOf('('), nextSentence.indexOf(')')];
    let maybeNumber;
    if (startParen >= 0 && endParen > 0) {
      const parenContent = nextSentence.substring(startParen + 1, endParen);
      console.log(parenContent);
      maybeNumber = parseInt(parenContent, 10);
    }
    setOccurencesFromString(maybeNumber ? maybeNumber : 1);
    setTextToSave(nextSentence)
  };

  const trimNumbers = (sentence) => {
    const regex = new RegExp(/^\(\d+\)/);
    if (regex.test(sentence)) {
      return sentence.slice(sentence.indexOf(')') + 1);
    }
    return sentence;
  }

  const prettyPrint = () => {
    const sortedData = Object.entries(keyData).sort((a, b) => b[1] - a[1]);
    const prettyData = sortedData.map(([key, count]) => {
      const firstWord = key.includes(' ') ? key.slice(0, key.indexOf(' ')) : key;
      const rest = key.includes(' ') && ` ${key.slice(key.indexOf(' ')).trim()}`;
      return (
      <>
        <span style={{fontWeight: 'bold'}}>
          {count > 1 && ` (${count})`} {firstWord}
        </span>
        {rest}.
      </>
      );
    });
    return prettyData;
  };

  const totalEntries = () => Object.values(keyData).reduce((acc, cur) => acc + cur, 0);

  const advanceCurrent = () => {
    const newIndex = currentIndex + 1;
    const nextSentence = sentences[newIndex];
    const [startParen, endParen] = [nextSentence.indexOf('('), nextSentence.indexOf(')')];
    let maybeNumber;
    if (startParen >= 0 && endParen > 0) {
      const parenContent = nextSentence.substring(startParen + 1, endParen);
      console.log(parenContent);
      maybeNumber = parseInt(parenContent, 10);
    }
    setOccurencesFromString(maybeNumber ? maybeNumber : 1);
    setCurrentIndex(newIndex);
    setTextToSave(nextSentence);
  };

  const combine = () => {
    const newIndex = currentIndex + 1;
    const nextSentence = `${textToSave}. ${sentences[newIndex]}`;
    setCurrentIndex(newIndex);
    setTextToSave(nextSentence);
  };

  const newEntry = () => {
    setKeyData({ ...keyData, [trimNumbers(textToSave).trim()]: occurencesFromString });
    advanceCurrent();
  };

  const incrementKey = (key) => {
    const oldCount = keyData[key];
    setKeyData({ ...keyData, [key]: oldCount + occurencesFromString });
    advanceCurrent();
  };

  return (
    <div className="App">
      <div style={{ background: '#2d447d', color: 'white' }}>
        <h1>Culture Parse</h1>
        <h5>v1.4.0</h5>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={clear}>Clear</button>&nbsp;
      </div>
      Enter text to be parsed below:
      <div>
        <textarea type="text" value={rawData} onChange={(event) => updateInput(event.target.value)} rows="3" cols="50" />
      </div>
      &nbsp;
      <div>
        <AutosizeInput type="text" value={textToSave} onChange={(event) => setTextToSave(event.target.value)} />&nbsp;
      </div>
      <div>
        <input type="number" style={{ width: 49 }} value={occurencesFromString} onChange={(event) => setOccurencesFromString(parseInt(event.target.value, 10))} />
      </div>
      <div>
        <button onClick={advanceCurrent}>Next/Ignore</button>&nbsp;
        <button disabled={Object.keys(keyData).includes(trimNumbers(textToSave))} onClick={newEntry}>New Entry</button>&nbsp;
        <button onClick={combine}>Combine</button>
      </div>
      &nbsp;
      <div>
        {Object.entries(keyData).sort((a, b) => b[1] - a[1]).map(([key, count]) => <div>{count}: <button onClick={() => incrementKey(key)}>{key}</button></div>)}
      </div>
      &nbsp;
      <div />
      {prettyPrint()}
      <div>
        <div>
        &nbsp;
        </div>
        Total Entries: {totalEntries()}
      </div>
    </div>
  );
}

export default CultureParse;
