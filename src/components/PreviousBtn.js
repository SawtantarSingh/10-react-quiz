function PreviousBtn({ dispatch, index }) {
  if (index > 0)
    return (
      <div>
        <button
          className="btn"
          onClick={() => dispatch({ type: "prevQuestion" })}
        >
          Prev
        </button>
      </div>
    );
}

export default PreviousBtn;
