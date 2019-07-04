import * as React from "react";
import { TraineeList } from "./TraineeList";
import { default as TestRenderer } from "react-test-renderer";
import { ApplicationContext } from "./App";
import { ApplicationState } from "./state/reducer";

describe("TraineeList", () => {
  test.each`
    description      | trainees
    ${"no trainee"}  | ${[]}
    ${"one trainee"} | ${[{ name: "Tester", price: 1500 }]}
  `(
    "should show TraineeList with $description",
    ({ description, trainees }) => {
      const state: ApplicationState = {
        trainees: trainees
      };

      const something = TestRenderer.create(
        <ApplicationContext.Provider value={{ state }}>
          <TraineeList />
        </ApplicationContext.Provider>
      );

      expect(something).toMatchSnapshot();
    }
  );
});
