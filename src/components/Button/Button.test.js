import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Button from "../Button";

Enzyme.configure({ adapter: new Adapter() });

describe("Button", () => {
  let onClick, btn;

  beforeAll(() => {
    onClick = jest.fn();
    btn = <Button onClick={onClick}>Click Me!</Button>;
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(btn, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("requires onClick prop", () => {
    expect(mount(btn).props().onClick).toBeDefined();
  });

  it("says 'Click Me!'", () => {
    const element = mount(btn).find("button");

    expect(element.contains("Click Me!")).toBe(true);
  });

  it("calls onClick when clicked", () => {
    const element = mount(btn).find("button");
    element.simulate("click");
    expect(onClick).toBeCalled();
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(btn);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
