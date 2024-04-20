"use client"
import React, { useState } from "react";
// import "./styles.css"; // Import your CSS file for styling

export default function Home() {
  interface Operators {
    [key: string]: boolean;
  }

  interface Test {
    first: number[];
    operator: string[];
    second: number[];
    answer: (string | number)[];
    isCorrect: boolean[];
  }

  const getRandomInt = (min: number, max: number) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  };

  const operatorsList = ["+", "-", "x", "÷"];

  const [operators, setOperators] = useState<Operators>({
    "+": false,
    "-": false,
    x: false,
    "÷": false,
  });

  const [test, setTest] = useState<Test>({
    first: [],
    operator: [],
    second: [],
    answer: [],
    isCorrect: [],
  });

  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(10);

  const changeOperator = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const key = event.target.name;
    const value = event.target.checked;
    setOperators((oldData) => ({
      ...oldData,
      [key]: value,
    }));
  };

  const generateTest = (): void => {
    const newTest: Test = {
      first: [],
      operator: [],
      second: [],
      answer: [],
      isCorrect: [],
    };

    const checkedOperators = Object.keys(operators).filter(
      (operator) => operators[operator]
    );

    for (let i = 0; i < numQuestions; i++) {
      let a, b, selectedOperator, result: any;
      do {
        a = getRandomInt(rangeStart, rangeEnd);
        b = getRandomInt(rangeStart, rangeEnd);
        selectedOperator =
          checkedOperators[
            Math.floor(Math.random() * checkedOperators.length)
          ];

        switch (selectedOperator) {
          case "+":
            result = a + b;
            break;
          case "-":
            result = a - b;
            break;
          case "x":
            result = a * b;
            break;
          case "÷":
            if (b === 0 || a % b !== 0) {
              result = -1; // set invalid result if division is not valid
            } else {
              result = Math.floor(a / b); // ensure result is integer
            }
            break;
          default:
            break;
        }
      } while (result <= 0); // repeat until valid result is generated

      newTest.first.push(a);
      newTest.second.push(b);
      newTest.operator.push(selectedOperator);
      newTest.answer.push("");
      newTest.isCorrect.push(true); // Initially assuming all answers are correct
    }

    setTest(newTest);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let score = 0;
    const newIsCorrect: boolean[] = [];
    test.answer.forEach((ans, index) => {
      const operator = test.operator[index];
      const result =
        operator === "+"
          ? test.first[index] + test.second[index]
          : operator === "-"
          ? test.first[index] - test.second[index]
          : operator === "x"
          ? test.first[index] * test.second[index]
          : operator === "÷"
          ? test.first[index] / test.second[index]
          : NaN; // Handle invalid operators
      const isCorrect = result === parseInt(ans.toString());
      newIsCorrect.push(isCorrect);
      if (isCorrect) score++;
    });
    setTest((oldTest) => ({ ...oldTest, isCorrect: newIsCorrect }));
    alert(`Your score is ${score}/${test.answer.length}`);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;
    const newAnswers = [...test.answer];
    newAnswers[index] = value;
    setTest((oldTest) => ({ ...oldTest, answer: newAnswers }));
  };

  const handleNumQuestionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setNumQuestions(value);
  };

  const handleRangeStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setRangeStart(value);
  };

  const handleRangeEndChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setRangeEnd(value);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6 text-center">Abacus Test</h1>
  <div className="flex items-center justify-center space-x-4 mb-6">
    {Object.keys(operators).map((operator) => (
      <label key={operator} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={operator}
          checked={operators[operator]}
          onChange={changeOperator}
        />
        <span className="text-lg font-semibold">{operator}</span>
      </label>
    ))}
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={generateTest}
    >
      Generate the Test
    </button>
  </div>

  <div className="mb-6">
    <label className="block mb-2">
      Number of Questions:
      <input
        type="number"
        value={numQuestions}
        onChange={handleNumQuestionsChange}
        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
      />
    </label>
  </div>

  <div className="flex items-center justify-center space-x-4 mb-6">
    <label className="block">
      Range Start:
      <input
        type="number"
        value={rangeStart}
        onChange={handleRangeStartChange}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
      />
    </label>
    <label className="block">
      Range End:
      <input
        type="number"
        value={rangeEnd}
        onChange={handleRangeEndChange}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
      />
    </label>
  </div>

  <form onSubmit={handleSubmit}>
    {test.first.map((num, index) => (
      <div key={index} className="flex items-center mb-4">
        <span className="text-lg font-semibold">
          {num} {test.operator[index]} {test.second[index]} =
        </span>
        <input
          type="number"
          name={`answer-${index}`}
          value={test.answer[index]}
          onChange={(e) => handleInputChange(e, index)}
          className={`border border-gray-300 rounded-md p-2 ml-2 w-20 text-center ${
            test.isCorrect[index] ? "bg-green-100" : "bg-red-100"
          }`}
        />
      </div>
    ))}
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Submit Test
    </button>
  </form>
</div>

  );
}
