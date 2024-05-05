function NumberOfQuestions({ dispatch, numQuestions, numberOfQuestions }) {
  return (
    <div className="start">
      <h2>Select Number Of Questions</h2>

      <input
        type="range"
        min={5}
        max={numQuestions}
        value={numberOfQuestions}
        onChange={(e) =>
          dispatch({ type: "selectQuestions", payload: Number(e.target.value) })
        }
      />

      <h4>{numberOfQuestions}</h4>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Next
      </button>
    </div>
  );
}

export default NumberOfQuestions;
