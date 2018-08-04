import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Search from "../Search";

Enzyme.configure({ adapter: new Adapter() });

describe("Search", () => {
  let onChange, onSubmit, searchForm;

  beforeAll(() => {
    onChange = jest.fn();
    onSubmit = jest.fn();
    searchForm = (
      <Search onChange={onChange} onSubmit={onSubmit}>
        Search
      </Search>
    );
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(searchForm, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("has a valid snapshot", () => {
    const component = renderer.create(searchForm);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has an input and a button", () => {
    const input = shallow(searchForm).find("input");
    expect(input).toBeDefined();

    const btn = shallow(searchForm).find("button");
    expect(btn).toBeDefined();
  });

  test("calls onChange when input changes", () => {
    const input = shallow(searchForm).find("input");
    input.simulate("change", "Different Input");
    expect(onChange).toBeCalledWith("Different Input");
  });

  test("calls onSubmit when search text is submitted", () => {
    const form = shallow(searchForm).find("form");
    form.simulate("submit");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
