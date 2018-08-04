import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "./App";
import Button from "./components/Button";
import Table from "./components/Table";
import Search from "./components/Search";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

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

describe("Button", () => {
  const props = {
    onClick: jest.fn()
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button {...props}>Click Me!</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Button {...props}>Click Me!</Button>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("says click me", () => {
    const element = shallow(<Button {...props}>Click Me!</Button>);

    expect(element.contains("Click Me!")).toBe(true);
  });
});

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
    ],
    sortKey: "TITLE",
    isSortReverse: false,
    onDismiss: jest.fn()
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two items in list", () => {
    const element = shallow(<Table {...props} />);

    expect(element.find(".table-row").length).toBe(2);
  });
});
