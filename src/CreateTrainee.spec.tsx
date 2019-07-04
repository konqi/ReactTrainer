import { render, fireEvent } from "@testing-library/react";
import * as React from "react";

import { ApplicationContext } from "./App";
import { CreateTrainee } from "./CreateTrainee";
import { ActionType } from "./state/actions";

test("loads items eventually", async () => {
  const dispatch = jest.fn();
  const { getByText, getByLabelText, unmount } = render(
    <ApplicationContext.Provider value={{ dispatch }}>
      <CreateTrainee />
    </ApplicationContext.Provider>
  );
  const expectedName = "Dr. Testilon";
  fireEvent.change(getByLabelText("Name"), {
    target: { value: expectedName }
  });

  const expectedPrice = 2000;
  fireEvent.change(getByLabelText("Preis"), {
    target: { value: expectedPrice }
  });

  // Click button
  fireEvent.click(getByText("Anlegen"));

  expect(dispatch).toHaveBeenCalledWith({
    type: ActionType.ADD_TRAINEE,
    payload: { name: expectedName, price: expectedPrice }
  });

  unmount();
});

it("should handle bad inputs nicely", () => {
  const { getByLabelText, unmount } = render(<CreateTrainee />);
  const priceInput = getByLabelText("Preis") as HTMLInputElement;

  const validValue = "4711";
  fireEvent.change(priceInput, {
    target: { value: validValue }
  });

  const invalidValue = "ABC";
  fireEvent.change(priceInput, {
    target: { value: invalidValue }
  });

  expect(priceInput.value).toBe(validValue);

  unmount();
});
