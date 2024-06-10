//Done:  Allowing the user to select different number of questions
//Done: Allowing the user to select the difficulty
//Done: going back and forth
//Working: Upload The highscore to fake api
// working

import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import NumberOfQuestions from "./NumberOfQuestions";
import PreviousBtn from "./PreviousBtn";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //  loading State , Error State , Ready State, active state ,finish state
  status: "loading",
  index: 0,
  answer: null,
  answerArray: [],
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  numberOfQuestions: null,
  difficulty: "all",
  filterQuestions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        filterQuestions: action.payload,
        status: "ready",
        // numberOfQuestions: action.payload.length,
        difficulty: action.payload,
      };

    case "highscoreReceived":
      return {
        ...state,
        highScore: action.payload,
      };

    case "dataFailed":
      return { ...state, status: "error" };

    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
        filterQuestions:
          action.payload === "easy"
            ? state.questions.filter((ques) => ques.points === 10)
            : action.payload === "medium"
            ? state.questions.filter((ques) => ques.points === 20)
            : action.payload === "hard"
            ? state.questions.filter((ques) => ques.points === 30)
            : state.questions,
      };

    case "numberOfQuestions":
      return {
        ...state,
        numberOfQuestions: state.filterQuestions.length,
        status: "questions",
        // secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "selectQuestions":
      return {
        ...state,
        numberOfQuestions: action.payload,
        // secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "start":
      return {
        ...state,
        status: "active",
        filterQuestions: state.filterQuestions.slice(
          0,
          state.numberOfQuestions
        ),
        secondsRemaining: state.numberOfQuestions * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.filterQuestions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        answerArray: [...state.answerArray, action.payload],
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: state.answerArray[state.index + 1]
          ? state.answerArray[state.index + 1]
          : null,
      };

    case "prevQuestion":
      return {
        ...state,
        index: state.index - 1,
        answer: state.answerArray[state.index - 1]
          ? state.answerArray[state.index - 1]
          : null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        filterQuestions: state.questions,
        status: "ready",
        highScore: state.highScore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    default:
      throw new Error("action is unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      numberOfQuestions,
      difficulty,
      filterQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = filterQuestions.length;
  const maxPossiblePoints = filterQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  useEffect(function () {
    fetch("http://localhost:9000/highScore")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "highscoreReceived", payload: data.highScore })
      )
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  useEffect(
    function () {
      if (status === "finished") {
        fetch("http://localhost:9000/highScore", {
          // Adding method type
          method: "POST",

          body: JSON.stringify({
            highScore: highScore,
          }),

          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => console.log(json))
          .catch((err) => dispatch({ type: "dataFailed" }));
      }
    },
    [status, highScore]
  );

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
            highScore={highScore}
          />
        )}
        {status === "questions" && (
          <NumberOfQuestions
            dispatch={dispatch}
            numQuestions={numQuestions}
            numberOfQuestions={numberOfQuestions}
          />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <PreviousBtn dispatch={dispatch} index={index} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <>
            <FinishedScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highScore={highScore}
              dispatch={dispatch}
              status={status}
            />
          </>
        )}
      </Main>
    </div>
  );
}
