function StartScreen({ numQuestions, dispatch, difficulty, highScore }) {
  return (
    <div className="start">
      <h3>Welcome To React Quiz!</h3>
      <h4>HighScore: {highScore}</h4>
      <select
        onChange={(e) =>
          dispatch({ type: "setDifficulty", payload: e.target.value })
        }
      >
        <option value={"all"}>All</option>
        <option value={"easy"}>Easy</option>
        <option value={"medium"}>Medium</option>
        <option value={"hard"}>Hard</option>
      </select>
      <h4>Select From {numQuestions} Question To Test Your Knowledge</h4>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "numberOfQuestions" })}
      >
        Let start
      </button>
    </div>
  );
}

export default StartScreen;
