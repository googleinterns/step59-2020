import React from 'react';
import {create} from 'react-test-renderer';
import {Quiz} from '../src/components/quiz/play/Quiz.jsx';
import * as styles from "../src/components/styles/QuizStyle";
import Instructions from "../src/components/quiz/Instructions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import NumericInput from "react-numeric-input";
import { render, fireEvent, cleanup } from '@testing-library/react';

test("it shows the correct player nickname", () => {
    const {getByLabelText, getByTestId} = render(<Quiz
        roomId='123456'
        nickname='abc test name'
        numSymbols={1}
        chartUrls={[""]}
        questionNum={0}
        net_worth={54321}
        money_left={12345}
        curShares={[1]}
        prices={[41976]}
    />);
    const nicknameText = getByTestId("nicknameText");
    expect(nicknameText.textContent).toBe("Hi there, abc test name!");
})

test("it shows the correct room ID", () => {
    const {getByLabelText, getByTestId} = render(<Quiz
        roomId='123456'
        nickname='abc test name'
        numSymbols={1}
        chartUrls={[""]}
        questionNum={0}
        net_worth={54321}
        money_left={12345}
        curShares={[1]}
        prices={[41976]}
    />);
    const roomIDText = getByTestId("roomIDText");
    expect(roomIDText.textContent).toBe("You are in Room 123456.");
})

test("it shows the correct user money", () => {
    const {getByLabelText, getByTestId} = render(<Quiz
        roomId='123456'
        nickname='abc test name'
        numSymbols={1}
        chartUrls={[""]}
        questionNum={0}
        net_worth={54321}
        money_left={12345}
        curShares={[1]}
        prices={[41976]}
    />);
    const userMoneyText = getByTestId("displayUserMoney");
    expect(userMoneyText.textContent).toBe("Your net worth is $54321.00 and you have $12345.00 in cash.");
})

test("it shows the right round number", () => {
    const {getByLabelText, getByTestId} = render(<Quiz
        roomId='123456'
        nickname='abc test name'
        numSymbols={1}
        chartUrls={[""]}
        questionNum={0}
        net_worth={54321}
        money_left={12345}
        curShares={[1]}
        prices={[41976]}
    />);
    const roundNumText = getByTestId("displayRoundNum");
    expect(roundNumText.textContent).toBe("Round: 0");
})

