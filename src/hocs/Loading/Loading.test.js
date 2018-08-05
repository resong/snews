import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { withLoading } from "../Loading";
import Button from "../../components/Button";

Enzyme.configure({ adapter: new Adapter() });

describe("Loading Container", () => {
  let ButtonWithLoading, onClick, isLoading;

  beforeAll(() => {
    onClick = jest.fn();
    isLoading = false;
    ButtonWithLoading = withLoading(Button);
  });

  test("renders button when not loading", () => {
    const element = shallow(
      <ButtonWithLoading isLoading={isLoading} onClick={onClick}>
        Test
      </ButtonWithLoading>
    );
    expect(element.find("Button").length).toBe(1);
  });

  test("renders spinner when loading", () => {
    isLoading = true;

    const element = shallow(
      <ButtonWithLoading isLoading={isLoading} onClick={onClick}>
        Test
      </ButtonWithLoading>
    );
    expect(element.html()).toBe(
      '<div><i class="fa fa-spinner fa-spin"></i></div>'
    );
  });
});
