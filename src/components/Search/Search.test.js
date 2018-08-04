import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";

import Search from "../Search";

describe("Search", () => {
  const props = {
    onChange: jest.fn(),
    onSubmit: jest.fn()
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Search {...props}>Search</Search>,

      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Search {...props}>Search</Search>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
