import { useEffect, useState } from "react";
import { Diary } from "./types";
import { createDiaryEntry, getAllDiary } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [dateEntry, setDateEntry] = useState('');
  const [visibilityEntry, setVisibilityEntry] = useState('');
  const [weatherEntry, setWeatherEntry] = useState('');
  const [commentEntry, setCommentEntry] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    getAllDiary()
      .then(data => {
        setDiaries(data);
      });
  }, []);

  const newDiaryEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd = {
      date: dateEntry,
      visibility: visibilityEntry,
      weather: weatherEntry,
      comment: commentEntry
    }
    createDiaryEntry(entryToAdd)
      .then(data => {
        setDiaries(diaries.concat(data))
        setDateEntry('')
        setCommentEntry('')
    })
    .catch(error => {
      setNotification({ message: error.response.data, type: 'red' });
      setTimeout(() => {
        setNotification({ message: '', type: '' })        
      }, 5000);
    })
  }

  return (
    <div>
      <h1>Add new entry</h1>
      <p style={{ color: notification.type }}>{notification.message}</p>
      <form onSubmit={newDiaryEntry}>
        <div>
          Date
          <input
            type="date"
            value={dateEntry}
            onChange={(event) =>setDateEntry(event.target.value)}
          />
        </div>
        <div style={{ margin: '10px 0 10px 0' }}>
          <span style={{ marginRight: '20px' }}>Visibility</span>
          great
          <input
            type="radio"
            value={'great'}
            name="v"
            onChange={(event) =>setVisibilityEntry(event.target.value)}
          />
          good
          <input
            type="radio"
            value={'good'}
            name="v"
            onChange={(event) =>setVisibilityEntry(event.target.value)}
          />
          ok
          <input
            type="radio"
            value={'ok'}
            name="v"
            onChange={(event) =>setVisibilityEntry(event.target.value)}
          />
          poor
          <input
            type="radio"
            value={'poor'}
            name="v"
            onChange={(event) =>setVisibilityEntry(event.target.value)}
          />
        </div>
        <div style={{ margin: '10px 0 10px 0' }}>
          <span style={{ marginRight: '20px' }}>Weather</span>
          sunny
          <input
            type="radio"
            value={'sunny'}
            name="w"
            onChange={(event) =>setWeatherEntry(event.target.value)}
          />
          rainy
          <input
            type="radio"
            value={'rainy'}
            name="w"
            onChange={(event) =>setWeatherEntry(event.target.value)}
          />
          cloudy
          <input
            type="radio"
            value={'cloudy'}
            name="w"
            onChange={(event) =>setWeatherEntry(event.target.value)}
          />
          stormy
          <input
            type="radio"
            value={'stormy'}
            name="w"
            onChange={(event) =>setWeatherEntry(event.target.value)}
          />
          windy
          <input
            type="radio"
            value={'windy'}
            name="w"
            onChange={(event) =>setWeatherEntry(event.target.value)}
          />
        </div>
        <div>
          Comment
          <input
            type="text"
            value={commentEntry}
            onChange={(event) =>setCommentEntry(event.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <h1>Diary Entries</h1>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          Visibility: {diary.visibility}<br />
          Weather: {diary.weather}
        </div>
      ))}      
    </div>
  )
}

export default App
